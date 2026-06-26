import ImageKit, {toFile} from "@imagekit/nodejs";

const imageKit = new ImageKit({privateKey: process.env.IMAGEKIT_PRIVATE_KEY});

function hasImageKitConfig() {
    return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

//image.png image.png sqme name for the different files

function createFileName(originalName = "upload") {
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `chat-${Date.now()}-${safeName}`;
}


async function uploadChatMedia(file) {
    const fileName = createFileName(file.originalName);

    const result = await imageKit.files.upload({
        file: await toFile(file.buffer, fileName, {rtype: file.mimetype}),
        fileName,
        folder: "/chat",
    });
  return result.url;
}

export {uploadChatMedia, hasImageKitConfig};