#!/bin/bash

export DATE=$(date)
export LOG_FILE="/root/logs/update.log"
echo "" >> ${LOG_FILE} 2>&1
echo "${DATE}: Started update service" >> ${LOG_FILE} 2>&1
# Set environment variables (example values)
export SERVICE_NAME="geely-medusajs"
echo "" >> ${LOG_FILE} 2>&1

# Login AWS registry
echo "${DATE}: Docker login" >> ${LOG_FILE} 2>&1
aws ecr get-login-password | docker login -u AWS --password-stdin "https://$(aws sts get-caller-identity --query 'Account' --output text).dkr.ecr.me-central-1.amazonaws.com"  >> ${LOG_FILE} 2>&1

# Define the old pattern and new image variables
repo_uri=$(aws  ecr describe-repositories --query "repositories[?repositoryName=='$SERVICE_NAME'].[repositoryUri]" --output text)
#latest_sha=$(aws  ecr describe-images --repository-name $SERVICE_NAME --query 'sort_by(imageDetails,&imagePushedAt)[-1].imageTags[0]' --output text)

#old_pattern="$repo_uri:[a-zA-Z0-9_\.\-]*"
new_image="891377086087.dkr.ecr.me-central-1.amazonaws.com/geely-medusajs:latest"
systemctl stop ${SERVICE_NAME}.service

while true; do
  if ! docker ps | grep -q $SERVICE_NAME; then
    echo "The container $SERVICE_NAME is stopped." >> ${LOG_FILE} 2>&1
    break
  else
    echo "The container $SERVICE_NAME is still running." >> ${LOG_FILE} 2>&1
  fi
  sleep 5  # Wait for 5 seconds before checking again
done

echo "" >> ${LOG_FILE} 2>&1
echo "Image: ${new_image}" >> ${LOG_FILE} 2>&1
echo "${DATE}: Delete old image" >> ${LOG_FILE} 2>&1
docker rmi -f $new_image >> ${LOG_FILE} 2>&1

echo "" >> ${LOG_FILE} 2>&1
echo "${DATE}: Pull new image" >> ${LOG_FILE} 2>&1
docker pull $new_image >> ${LOG_FILE} 2>&1

# Restart the service
echo "" >> ${LOG_FILE} 2>&1
echo "${DATE}: Restart service" >> ${LOG_FILE} 2>&1

systemctl start ${SERVICE_NAME}.service

echo "############################################################" >> ${LOG_FILE} 2>&1
echo "" >> ${LOG_FILE} 2>&1

# # Set environment variables (example values)
# export SERVICE_NAME="geely-medusajs"

# # Login AWS registry
# aws ecr get-login-password | docker login -u AWS --password-stdin "https://$(aws  sts get-caller-identity --query 'Account' --output text).dkr.ecr.me-central-1.amazonaws.com"

# # Define the old pattern and new image variables
# repo_uri=$(aws  ecr describe-repositories --query "repositories[?repositoryName=='$SERVICE_NAME'].[repositoryUri]" --output text)
# #latest_sha=$(aws  ecr describe-images --repository-name $SERVICE_NAME --query 'sort_by(imageDetails,&imagePushedAt)[-1].imageTags[0]' --output text)

# #old_pattern="$repo_uri:[a-zA-Z0-9_\.\-]*"
# new_image="$repo_uri:latest"
# systemctl stop ${SERVICE_NAME}.service
# docker rmi $new_image
# docker pull $new_image

# #service_file="/etc/systemd/system/$SERVICE_NAME.service"

# # Replace the old pattern with the new image in the service file
# #sed -i "s|${old_pattern}|${new_image}|g" $service_file

# # Pull the new Docker image
# #docker pull $new_image

# # Reload the systemd manager configuration
# systemctl daemon-reload

# # Restart the service
# systemctl start ${SERVICE_NAME}.service
