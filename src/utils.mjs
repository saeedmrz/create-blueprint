import path from "node:path";
import {
  writeFile,
  lstat,
  readdir,
  mkdir,
  copyFile,
  readFile,
} from "fs/promises";

const copyFilesAndDirectories = async (source, destination) => {
  const entries = await readdir(source);

  for (const entry of entries) {
    const sourcePath = path.join(source, entry);
    const destPath = path.join(destination, entry);

    const stat = await lstat(sourcePath);

    if (stat.isDirectory()) {
      // Create the directory in the destination
      await mkdir(destPath);

      // Recursively copy files and subdirectories
      await copyFilesAndDirectories(sourcePath, destPath);
    } else {
      // Copy the file
      await copyFile(sourcePath, destPath);
    }
  }
};

const renamePackageJsonName = async (targetDir, projectName) => {
  const packageJsonPath = path.join(targetDir, "package.json");
  try {
    const packageJsonData = await readFile(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonData);
    packageJson.name = projectName;
    await writeFile(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2),
      "utf8"
    );
  } catch (err) {
    console.log(err.message);
  }
};

export { copyFilesAndDirectories, renamePackageJsonName };
