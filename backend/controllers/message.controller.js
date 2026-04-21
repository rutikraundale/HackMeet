import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// @desc    Send a message
// @route   POST /api/messages/:receiverId
export const sendMessage = async (req, res) => {
    try {
        const { text } = req.body;
        const { receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                lastMessage: {
                    text: text,
                    sender: senderId,
                    seen: false
                }
            });
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            reciever: receiverId, // Model has reciever natively spelled this way
            text
        });

        if (newMessage) {
            conversation.lastMessage = {
                text: text,
                sender: senderId,
                seen: false
            };
            // Execute parallel document saves
            await Promise.all([conversation.save(), newMessage.save()]);
        }

        // Real-time Event Emission -> To Receiver User
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            // Optionally emit a conversational bump update
            io.to(receiverSocketId).emit("updateConversation", conversation._id);
        }

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error("Error in sendMessage controller: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Get messages between logged in user and another user
// @route   GET /api/messages/:otherUserId
export const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, otherUserId] }
        });

        if (!conversation) return res.status(200).json({ success: true, data: [] });

        const messages = await Message.find({
            conversationId: conversation._id
        }).sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Error in getMessages controller: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// @desc    Get all active conversations for a user
// @route   GET /api/messages/conversations
export const getConversations = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const conversations = await Conversation.find({
            participants: userId
        }).populate({
            path: "participants",
            select: "username profilePicture"
        }).sort({ updatedAt: -1 });

        // Filter out logged user from array, so client natively gets target user format
        const formattedConversations = conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
                (p) => p._id.toString() !== userId.toString()
            );
            
            return {
                _id: conv._id,
                user: otherParticipant,
                lastMessage: conv.lastMessage,
                updatedAt: conv.updatedAt
            };
        });

        res.status(200).json({ success: true, data: formattedConversations });
    } catch (error) {
        console.error("Error in getConversations controller: ", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
