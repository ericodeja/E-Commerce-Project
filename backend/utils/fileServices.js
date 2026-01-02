import fs from "fs/promises";


const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error.message);
    return [];
  }
};

const writeFile = async (filePath,content) => {
  try {
    const data = JSON.stringify(content, null, 2);
    await fs.writeFile(filePath, data, "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing content:", error.message);
    return false;
  }
};

export { readFile, writeFile };
