const fs = require('fs');
const path = require('path');

const servicesConfig = require('../config/services.json');
let backgroundJobsConfig = {};
let cronsConfig = {};

try {
  backgroundJobsConfig = require('../config/background-jobs.json');
} catch (error) {
  console.warn("Warning: background-jobs.json is empty or invalid.");
}

try {
  cronsConfig = require('../config/crons.json');
} catch (error) {
  console.warn("Warning: crons.json is empty or invalid.");
}

const deploymentTemplate = fs.readFileSync(path.join(__dirname, '../templates/deployment-template.yaml'), 'utf8');
const serviceTemplate = fs.readFileSync(path.join(__dirname, '../templates/service-template.yaml'), 'utf8');
const backgroundJobTemplate = fs.readFileSync(path.join(__dirname, '../templates/background-job-template.yaml'), 'utf8');
const cronJobTemplate = fs.readFileSync(path.join(__dirname, '../templates/cron-job-template.yaml'), 'utf8');

const servicesDir = path.join(__dirname, '../services');
const jobsDir = path.join(__dirname, '../jobs');

fs.mkdirSync(servicesDir, { recursive: true });
fs.mkdirSync(path.join(jobsDir, 'background'), { recursive: true });
fs.mkdirSync(path.join(jobsDir, 'cron'), { recursive: true });

function generateYaml(template, values) {
  const envVars = values.environmentVariables && Object.keys(values.environmentVariables).length > 0
    ? `        env:\n` +
      Object.entries(values.environmentVariables)
        .map(([key, value]) => `        - name: ${key}\n          value: "${value}"`)
        .join('\n')
    : "";

  return template
    .replace(/{{SERVICE_NAME}}/g, values.serviceName)
    .replace(/{{IMAGE}}/g, values.image || "")
    .replace(/{{REPLICAS}}/g, values.replicas || 1)
    .replace(/{{PORT}}/g, values.port || "")
    .replace(/{{TARGET_PORT}}/g, values.targetPort || "")
    .replace(/{{FILE_TO_RUN}}/g, values.fileToRun || "")
    .replace(/{{SCHEDULE}}/g, values.schedule || "")
    .replace(/{{ENV_VARS}}/g, envVars);
}

// Generate Services and Deployments
Object.entries(servicesConfig).forEach(([serviceName, config]) => {
  const deploymentYaml = generateYaml(deploymentTemplate, {
    serviceName,
    image: config.image,
    replicas: config.replicas,
    port: config.port,
    environmentVariables: config.env
  });

  const serviceYaml = generateYaml(serviceTemplate, {
    serviceName,
    port: config.port,
    targetPort: config.targetPort
  });

  fs.writeFileSync(path.join(servicesDir, `${serviceName}.yaml`), serviceYaml, 'utf8');
  fs.writeFileSync(path.join(servicesDir, `${serviceName}-deployment.yaml`), deploymentYaml, 'utf8');

  console.log(`Generated Service & Deployment for: ${serviceName}`);
});

// Generate Background Jobs if not empty
if (backgroundJobsConfig && Object.keys(backgroundJobsConfig).length > 0) {
  Object.entries(backgroundJobsConfig).forEach(([jobName, config]) => {
    const yamlContent = generateYaml(backgroundJobTemplate, {
      serviceName: jobName,
      image: config.image,
      fileToRun: config.fileToRun,
      environmentVariables: config.environmentVariables,
      replicas: config.replicas || 1
    });

    fs.writeFileSync(path.join(jobsDir, 'background', `${jobName}.yaml`), yamlContent, 'utf8');
    console.log(`Generated background job: ${jobName}`);
  });
} else {
  console.log("No background jobs to generate.");
}

// Generate Cron Jobs if not empty
if (cronsConfig && Object.keys(cronsConfig).length > 0) {
  Object.entries(cronsConfig).forEach(([jobName, config]) => {
    const yamlContent = generateYaml(cronJobTemplate, {
      serviceName: jobName,
      image: config.image,
      fileToRun: config.fileToRun,
      schedule: config.schedule,
      environmentVariables: config.environmentVariables
    });

    fs.writeFileSync(path.join(jobsDir, 'cron', `${jobName}.yaml`), yamlContent, 'utf8');
    console.log(`Generated cron job: ${jobName}`);
  });
} else {
  console.log("No cron jobs to generate.");
}
