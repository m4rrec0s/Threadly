import fs from "fs/promises";

const databasePath = "api.json";

export async function readData(key: string) {
  const fileContent = await fs.readFile("api.json", "utf-8");
  const data = JSON.parse(fileContent);
  return data[key];
}

export const writeData = async (entity: string, saveData: any) => {
  const fileContent = await fs.readFile(databasePath, "utf-8");
  const dataParse = JSON.parse(fileContent);

  if (!dataParse[entity]) {
    throw new Error("Entity not found.");
  }

  dataParse[entity].push(saveData);

  await fs.writeFile(databasePath, JSON.stringify(dataParse, null, "\t"));
};
