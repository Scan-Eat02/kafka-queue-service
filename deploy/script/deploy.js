const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const servicesDir = path.join(__dirname, "../services");
const backgroundJobsDir = path.join(__dirname, "../jobs/background");
const cronJobsDir = path.join(__dirname, "../jobs/cron");


function applyYamlFiles(directory) {
  if (!fs.existsSync(directory)) {
    console.warn(`⚠️ Skipping: ${directory} (Directory not found)`);
    return;
  }

  const files = fs.readdirSync(directory);
  const serviceFiles = [];
  const deploymentFiles = [];
  const otherFiles = [];

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    if (fs.lstatSync(filePath).isDirectory()) return; // Skip subdirectories

    if (file.endsWith(".yaml") || file.endsWith(".yml")) {
      if (file.includes("service")) {
        serviceFiles.push(filePath);
      } else if (file.includes("deployment")) {
        deploymentFiles.push(filePath);
      } else {
        otherFiles.push(filePath);
      }
    }
  });
  
  otherFiles.forEach((file) => applyFile(file));
  // Apply Services first
  serviceFiles.forEach((file) => applyFile(file));

  // Apply Deployments next
  deploymentFiles.forEach((file) => applyFile(file));

  // Apply any other YAML files (e.g., ConfigMaps, Secrets, Jobs)
}

function applyFile(filePath) {
    try {
      console.log(`🚀 Applying: ${filePath}`);
      execSync(`$HOME/bin/kubectl apply -f ${filePath}`, { stdio: "inherit", shell: true });
    } catch (error) {
      console.error(`❌ Failed to apply ${filePath}:`, error.message);
    }
  }

// Deploy services (services + deployments)
console.log("📦 Deploying services...");
applyYamlFiles(servicesDir);

// Deploy background jobs
console.log("🎯 Deploying background jobs...");
applyYamlFiles(backgroundJobsDir);

// Deploy cron jobs
console.log("⏳ Deploying cron jobs...");
applyYamlFiles(cronJobsDir);

console.log("✅ Kubernetes Deployment Completed!");
