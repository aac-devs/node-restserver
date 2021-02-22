const path = require("path");
const { v4: uuidv4 } = require("uuid");
const imageExtensions = ["png", "jpg", "jpeg", "gif"];

const uploadFile = (
  files,
  allowedExtensions = imageExtensions,
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cuttedName = file.name.split(".");
    const extension = cuttedName[cuttedName.length - 1];

    // Validar extensión
    if (!allowedExtensions.includes(extension)) {
      return reject(
        `The extension ${extension} isn't allowed - (${allowedExtensions})`
      );
    }
    const tempFilename = uuidv4() + "." + extension;
    const uploadPath = path.join(
      __dirname,
      "../uploads/",
      folder,
      tempFilename
    );
    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }
      resolve(tempFilename);
    });
  });
};

module.exports = {
  uploadFile,
};
