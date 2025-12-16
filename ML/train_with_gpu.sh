#!/bin/bash
# Helper script to run python with pip-installed NVIDIA libraries from the Multi-Predict venv

# Absolute path to the working venv in the other project
VENV_PATH="/home/tish/thas/Multi-Predict/ML/venv"
SITE_PACKAGES="$VENV_PATH/lib/python3.10/site-packages"

# Export library paths so TensorFlow can find cuDNN/cuBLAS etc.
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cuda_runtime/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cudnn/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cublas/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cufft/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/curand/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cusolver/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/cusparse/lib
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$SITE_PACKAGES/nvidia/nccl/lib

echo "✅ Set LD_LIBRARY_PATH to include CUDA libs from Multi-Predict."

# Run the passed command using the VENV python
echo "🚀 Running: $@"
"$VENV_PATH/bin/python3" "$@"
