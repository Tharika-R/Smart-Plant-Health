import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { prisma } from '../config/prisma';
import { analyzePlantImageWithGemini } from '../services/geminiService';

export const analyzePlantVision = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Plant image file is required.' });
    }

    const { plantId } = req.body;

    // 1. Run Gemini Vision Analysis (Server-side Gemini 1.5 Flash Vision Model)
    const geminiResult = await analyzePlantImageWithGemini(file.path, file.mimetype);

    // 2. Fetch Latest NPK Soil Telemetry if plantId provided
    let latestSensorReading = null;
    let targetPlantId = plantId;

    if (!targetPlantId) {
      const firstPlant = await prisma.plant.findFirst();
      if (firstPlant) targetPlantId = firstPlant.id;
    }

    if (targetPlantId) {
      latestSensorReading = await prisma.sensorReading.findFirst({
        where: { plantId: targetPlantId },
        orderBy: { timestamp: 'desc' }
      });
    }

    // 3. Save PlantImage and PlantAnalysis to Database
    let createdImage = null;
    if (targetPlantId) {
      createdImage = await prisma.plantImage.create({
        data: {
          plantId: targetPlantId,
          imageUrl: `/uploads/${file.filename}`
        }
      });

      await prisma.plantAnalysis.create({
        data: {
          plantId: targetPlantId,
          imageId: createdImage.id,
          plantName: geminiResult.plantName,
          plantConfidence: geminiResult.plantConfidence,
          overallHealth: geminiResult.overallHealth,
          healthStatus: geminiResult.healthStatus,
          analysisJson: geminiResult as any
        }
      });
    }

    // 4. Multi-Modal Fusion Logic (Combine Visual Assessment + NPK Telemetry)
    const nitrogenStatus = geminiResult.nutrientAssessment.nitrogen.status;
    const phosphorusStatus = geminiResult.nutrientAssessment.phosphorus.status;
    const potassiumStatus = geminiResult.nutrientAssessment.potassium.status;

    const responsePayload = {
      analysisId: createdImage ? createdImage.id : `analysis-${Date.now()}`,
      plantName: geminiResult.plantName,
      plantConfidence: geminiResult.plantConfidence,
      healthScore: geminiResult.overallHealth,
      healthStatus: geminiResult.healthStatus,
      nutrients: {
        nitrogen: {
          status: nitrogenStatus,
          confidence: geminiResult.nutrientAssessment.nitrogen.confidence,
          recommendDispense: nitrogenStatus === 'LOW'
        },
        phosphorus: {
          status: phosphorusStatus,
          confidence: geminiResult.nutrientAssessment.phosphorus.confidence,
          recommendDispense: phosphorusStatus === 'LOW'
        },
        potassium: {
          status: potassiumStatus,
          confidence: geminiResult.nutrientAssessment.potassium.confidence,
          recommendDispense: potassiumStatus === 'LOW'
        }
      },
      visibleIssues: geminiResult.visibleIssues,
      observations: geminiResult.observations,
      recommendations: geminiResult.recommendations,
      sensorContext: latestSensorReading ? {
        soilMoisture: latestSensorReading.soilMoisture,
        temperature: latestSensorReading.temperature,
        humidity: latestSensorReading.humidity,
        nitrogenReading: latestSensorReading.nitrogen,
        phosphorusReading: latestSensorReading.phosphorus,
        potassiumReading: latestSensorReading.potassium
      } : null,
      needsHumanReview: geminiResult.needsHumanReview
    };

    return res.json(responsePayload);
  } catch (error: any) {
    console.error('Vision analysis error:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze plant vision.' });
  }
};

export const getVisionHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const history = await prisma.plantAnalysis.findMany({
      where: { plantId: id },
      include: { image: true },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ history });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch plant vision history.' });
  }
};
