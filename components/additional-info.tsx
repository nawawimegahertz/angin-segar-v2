import { Info, Heart } from "lucide-react"
import { StatusBadge } from "@/components/ui/sensor-card"

interface SensorDataProps {
  temperature: string
  humidity: string
  windSpeed: string
  windUnit: string
  soilMoisture: string
}

interface AdditionalInfoProps {
  sensorData: SensorDataProps
}

export default function AdditionalInfo({ sensorData }: AdditionalInfoProps) {
  // Generate weather summary based on sensor data
  const generateWeatherSummary = () => {
    const temp = Number.parseFloat(sensorData.temperature)
    const humidity = Number.parseFloat(sensorData.humidity)
    const wind = Number.parseFloat(sensorData.windSpeed)
    const soil = Number.parseFloat(sensorData.soilMoisture)

    if (isNaN(temp) || isNaN(humidity) || isNaN(wind) || isNaN(soil)) {
      return (
        <p className="mb-3">
          <span className="inline-block animate-spin mr-2">⟳</span> Analyzing weather data...
        </p>
      )
    }

    let tempDescription
    if (temp > 30) {
      tempDescription = "Hot"
    } else if (temp > 25) {
      tempDescription = "Warm"
    } else if (temp > 20) {
      tempDescription = "Mild"
    } else {
      tempDescription = "Cool"
    }

    let windDescription
    if (wind > 20) {
      windDescription = "windy"
    } else if (wind > 10) {
      windDescription = "moderate breeze"
    } else {
      windDescription = "calm"
    }

    let soilDescription
    if (soil < 30) {
      soilDescription = "Soil is very dry, consider watering."
    } else if (soil < 50) {
      soilDescription = "Soil is in dry condition."
    } else if (soil < 70) {
      soilDescription = "Soil moisture is optimal for plants."
    } else {
      soilDescription = "Soil is very wet, watering not required."
    }

    return (
      <>
        <p className="mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-cyan-100 dark:bg-cyan-800 rounded-full">
            <span className="text-cyan-700 dark:text-cyan-200">🌡️</span>
          </span>
          Current air temperature <span className="font-semibold">{sensorData.temperature}°C</span> ({tempDescription})
          with humidity <span className="font-semibold">{sensorData.humidity}%</span>.
        </p>
        <p className="mb-2">
          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-emerald-100 dark:bg-emerald-800 rounded-full">
            <span className="text-emerald-700 dark:text-emerald-200">💨</span>
          </span>
          Wind speed{" "}
          <span className="font-semibold">
            {sensorData.windSpeed} {sensorData.windUnit}
          </span>
          , conditions are {windDescription}.
        </p>
        <p>
          <span className="inline-flex items-center justify-center w-6 h-6 mr-2 bg-teal-100 dark:bg-teal-800 rounded-full">
            <span className="text-teal-700 dark:text-teal-200">🌱</span>
          </span>
          {soilDescription}
        </p>
      </>
    )
  }

  return (
    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weather Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center">
          <Info className="mr-2" /> Weather Summary
        </h2>
        <div className="text-gray-700 dark:text-gray-300">{generateWeatherSummary()}</div>
      </div>

      {/* Sensor Health */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-colors duration-300">
        <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center">
          <Heart className="mr-2" /> Sensor Health
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">DHT22 (Temperature & Humidity)</span>
            <StatusBadge variant="success">Optimal</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Anemometer (Wind)</span>
            <StatusBadge variant="success">Optimal</StatusBadge>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700 dark:text-gray-300">Soil Moisture (Soil)</span>
            <StatusBadge variant="warning">Needs Calibration</StatusBadge>
          </div>
        </div>
      </div>
    </div>
  )
}
