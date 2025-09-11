import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import User from "../models/user.model.js";
import moment from "moment";

export const getCurrentUser = async (req, res) => {
  try {
    console.log("📩 getCurrentUser called by user:", req.userId);

    const userId = req.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      console.error("❌ getCurrentUser: user not found for id", userId);
      return res.status(400).json({ message: "user not found" });
    }

    console.log("✅ getCurrentUser success:", user.name);
    return res.status(200).json(user);
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    return res.status(400).json({ message: "get current user error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    console.log("📩 updateAssistant called by user:", req.userId);
    console.log("📦 Body:", req.body);
    console.log("📸 File:", req.file);

    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      try {
        console.log("☁ Uploading to Cloudinary:", req.file.path);
        assistantImage = await uploadOnCloudinary(req.file.path);
        console.log("✅ Cloudinary uploaded:", assistantImage);
      } catch (cloudErr) {
        console.error("❌ Cloudinary upload failed:", cloudErr);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }
    } else {
      assistantImage = imageUrl;
      console.log("ℹ Using existing imageUrl:", imageUrl);
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    if (!user) {
      console.error("❌ updateAssistant: user not found for id", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ updateAssistant success:", user.assistantName);
    return res.status(200).json(user);
  } catch (error) {
    console.error("❌ updateAssistant error:", error);
    return res.status(400).json({ message: "updateAssistant error" });
  }
};

export const askToAssistant = async (req, res) => {
  try {
    console.log("📩 askToAssistant called by user:", req.userId);
    console.log("📝 Body:", req.body);

    const { command } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      console.error("❌ askToAssistant: user not found for id", req.userId);
      return res.status(404).json({ message: "User not found" });
    }

    user.history.push(command);
    await user.save();
    console.log("🕒 History updated with:", command);

    const userName = user.name;
    const assistantName = user.assistantName;
    console.log("👤 User:", userName, "| 🤖 Assistant:", assistantName);

    const result = await geminiResponse(command, assistantName, userName);
    console.log("📡 Gemini raw result:", result);

    const jsonMatch = result.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      console.error("❌ Gemini response invalid:", result);
      return res.status(400).json({ response: "sorry, i can't understand" });
    }

    const gemResult = JSON.parse(jsonMatch[0]);
    console.log("✅ Gemini parsed:", gemResult);

    const type = gemResult.type;
    console.log("🔎 Command type:", type);

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `current time is ${moment().format("hh:mm A")}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("MMMM")}`,
        });

      case "google-search":
      case "youtube-search":
      case "youtube-play":
      case "general":
      case "calculator-open":
      case "instagram-open":
      case "facebook-open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: gemResult.response,
        });

      default:
        console.error("❌ Unknown command type:", type);
        return res
          .status(400)
          .json({ response: "I didn't understand that command." });
    }
  } catch (error) {
    console.error("❌ askToAssistant error:", error);
    return res.status(500).json({ response: "Ask assistant error" });
  }
};
