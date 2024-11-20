const express = require("express");
const app = express.Router();
const { Song } = require("../schemas/schemas");
const multer = require("multer");
const mongoose = require("mongoose");
const { Readable } = require("stream");

//set up gridfs storage / multer

const storage = multer.memoryStorage();
const fs = require("fs");
const upload = multer({ storage });

//set up file retrieval

app.post("/", upload.array("audioFiles", 20), async (req, res) => {
  // 20 is max amount of files allowed to upload
  const gridfsSongBucket = req.app.locals.gridfsSongBucket; // Access GridFS instance

  try {
    if (!req.file) return res.status(400).send("No file uploaded.");

    const uploadStream = gridfsSongBucket.openUploadStream(
      req.file.originalname,
      {
        contentType: req.file.mimetype,
      }
    );

    const readableStream = Readable.from(req.file.buffer);

    readableStream
      .pipe(uploadStream)
      .on("error", (err) => {
        console.error("Error uploading file:", err);
        res.status(500).json({ message: "Upload failed" });
      })
      .on("finish", async () => {
        console.log("File uploaded successfully");

        const { ownerId, projectId, title } = req.body;
        const newSong = new Song({
          ownerId: ownerId || "1",
          projectId: projectId || "1",
          fileName: req.file.originalname,
          mimeType: req.file.mimetype,
          title: title || req.file.originalname,
          songId: uploadStream.id, // Use the ID from the upload stream
        });

        await newSong.save();
        res.status(200).json(newSong);
      });
  } catch (err) {
    console.error("Error in file upload:", err);
    res.status(500).send(err);
  }
});
///get a single song

// app.get("/:songId", async (req, res) => {
//   try {
//     const gridfsBucket = req.app.locals.gridfsBucket; // Access GridFS instance
//     const { songId } = req.params;
//     // Validate the songId before proceeding
//     if (!mongoose.Types.ObjectId.isValid(songId)) {
//       return res.status(400).json({ message: "Invalid song ID format" });
//     }
//     const fileId = new mongoose.Types.ObjectId(songId);
//     const file = await gridfsBucket.files.find({ _id: fileId }).toArray();

//     if (!file || file.length === 0) {
//       return res.status(404).json({ message: "File not found" });
//     }
//     // res.status(200).send(file);
//     // Check if it's an audio file
//     if (file.contentType === "audio/mpeg" || file.contentType === "audio/wav") {
//       // Set the response header for correct audio MIME type
//       res.set("Content-Type", file[0].contentType);

//       //     // Stream the audio file from GridFS
//       const readstream = await gridfsBucket.createReadStream({ _id: file._id });
//       readstream.pipe(res);
//       // Handle errors during streaming
//       readstream.on("error", (err) => {
//         console.error("Stream error:", err);
//         res.status(500).send("Error streaming the file");
//       });
//     } else {
//       res.status(400).json({ message: "Not an audio file" });
//     }
//   } catch (err) {
//     console.error("Error retrieving file:", err);
//     res.status(500).send(err);
//   }
// });

app.get("/:songId", async (req, res) => {
  try {
    const gridfsBucket = req.app.locals.gridfsBucket; // Access GridFS instance
    const { songId } = req.params;

    // Validate the songId before proceeding
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid song ID format" });
    }

    const fileId = new mongoose.Types.ObjectId(songId);

    // Find the file in GridFS
    const file = await gridfsBucket.find({ _id: fileId }).toArray();

    if (file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file is an audio file
    const audioMimeTypes = ["audio/mpeg", "audio/wav"];
    if (!audioMimeTypes.includes(file[0].contentType)) {
      return res.status(400).json({ message: "Not an audio file" });
    }

    // Set the response header for correct audio MIME type
    res.set("Content-Type", file[0].contentType);

    // Stream the audio file from GridFS
    const readstream = gridfsBucket.openDownloadStream(fileId);
    readstream.pipe(res);

    // Handle errors during streaming
    readstream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(500).send("Error streaming the file");
    });
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).send(err);
  }
});

module.exports = app;
