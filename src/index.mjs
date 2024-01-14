import fs from "fs";
import path from "node:path";
import prompts from "prompts";
import { fileURLToPath } from "node:url";
import { copyFilesAndDirectories, renamePackageJsonName } from "./utils.mjs";
import { blue, yellow, cyan, magenta } from "kolorist";

const projectNamePattern = /^[a-zA-Z0-9-]+$/;

const templates = [
  {
    value: "react-js",
    title: `${yellow("React-JS")}`,
    description: "Vite + React + JavaScript.",
  },
  {
    value: "pwa-react-js",
    title: `${magenta("PWA-React-JS")}`,
    description: "Vite + PWA + React + JavaScript.",
  },
  {
    value: "pwa-react-ts",
    title: `${blue("PWA-React-TS")}`,
    description: "Vite + PWA + React + TypeScript.",
  },
];

const init = async () => {
  try {
    const response = await prompts([
      {
        type: "select",
        name: "template",
        message: "Select template",
        choices: templates,
      },
      {
        type: "text",
        name: "projectName",
        message: "Enter your project name",
        initial: "my-project",
        format: (val) => val.toLowerCase().split(" ").join("-"),
        validate: (val) =>
          projectNamePattern.test(val)
            ? true
            : "Project name should not contain special characters except hyphen (-)",
      },
    ]);
    const { projectName, template } = response;
    const targetDir = path.join(process.cwd(), projectName);
    const sourceDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../templates",
      `${template}`
    );
    if (!fs.existsSync(targetDir)) {
      console.log("Target directory doesn't exist");
      console.log("Creating directory...");
      fs.mkdirSync(targetDir, { recursive: true });
      console.log("Finished creating directory");
      await copyFilesAndDirectories(sourceDir, targetDir);
      await renamePackageJsonName(targetDir, projectName);
      console.log(`Finished generating your project ${projectName} \n`);
      console.log(`${cyan(`cd ${projectName}`)}`);
      console.log(`${cyan(`npm install`)}`);
    } else {
      throw new Error("Target directory already exist!");
    }
  } catch (err) {
    console.log(err.message);
  }
};

init();
