import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
    {
        userId: {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        label: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        jdText: {
            type: String,
            required: true,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
        },
        matchedSkills: {
            type: [String],
            required: true,
        },
        missingSkills: {
            type: [String],
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

analysisSchema.index({ userId: 1, createdAt: -1 });

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
