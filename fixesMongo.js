const mongoose = require("mongoose");

// Replace with your actual MongoDB connection string
const MONGO_URI = "mongodb+srv://sunandhitgupta:sunandhit@cluster0.aa3uw.mongodb.net/";

async function fixIndexes() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const User = mongoose.model("User", new mongoose.Schema({ rollNumber: String }), "users");

        console.log("🔍 Cleaning up invalid rollNumber values...");
        await User.updateMany({ rollNumber: "" }, { $unset: { rollNumber: "" } });
        await User.updateMany({ rollNumber: null }, { $unset: { rollNumber: "" } });

        console.log("🔍 Checking existing indexes...");
        const indexes = await User.collection.getIndexes();
        console.log("Indexes:", indexes);

        if (indexes.rollNumber_1) {
            console.log("🚀 Dropping old rollNumber index...");
            await User.collection.dropIndex("rollNumber_1");
        }

        console.log("✅ Creating new rollNumber index...");
        await User.collection.createIndex({ rollNumber: 1 }, { unique: true, sparse: true });

        console.log("🎉 Indexes fixed successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error fixing indexes:", error);
        process.exit(1);
    }
}

fixIndexes();
