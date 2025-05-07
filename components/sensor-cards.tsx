"use client"

import { Button } from "@/components/ui/button"
import {
  Thermometer,
  Droplet,
  Wind,
  SproutIcon as Seedling,
  RefreshCw,
  AlertTriangle,
  DropletIcon as DropletOff,
  CheckCircle,
  Umbrella,
  BatteryMedium,
  History,
  ArrowUp,
  ArrowDown,
  ThermometerSnowflake,
} from "lucide-react"
import { SensorCard, CardFooter, FooterItem, SensorValue, SensorLabel } from "@/components/ui/sensor-card"
import { WindIndicator } from "@/components/ui/wind-indicator"

interface SensorDataProps {
  temperature: string
  humidity: string
  windSpeed: string
  windUnit: string
  windMax: string
  windMin: string
  soilMoisture: string
  soilTemp: string
  soilStatus: string
  soilStatusIcon: string
}

interface SensorCardsProps {
  sensorData: SensorDataProps
  toggleWindUnit: () => void
}

export default function SensorCards({ sensorData, toggleWindUnit }: SensorCardsProps) {
  // Get current time for display
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Render soil status icon based on status
  const renderSoilStatusIcon = () => {
    switch (sensorData.soilStatusIcon) {
      case "alert-triangle":
        return <AlertTriangle className="w-4 h-4 mr-1" />
      case "droplet-off":
        return <DropletOff className="w-4 h-4 mr-1" />
      case "check-circle":
        return <CheckCircle className="w-4 h-4 mr-1" />
      case "droplet":
        return <Droplet className="w-4 h-4 mr-1" />
      case "umbrella":
        return <Umbrella className="w-4 h-4 mr-1" />
      default:
        return <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Temperature & Humidity Card */}
      <SensorCard
        title={
          <>
            <Thermometer className="inline mr-2" /> Temperature & Humidity
          </>
        }
        sensorType="DHT22"
        gradient="bg-gradient-to-br from-cyan-100 to-teal-200 dark:from-cyan-900 dark:to-teal-800"
      >
        <div className="grid grid-cols-2 gap-4 flex-grow w-full">
          {/* Temperature */}
          <div className="bg-white/30 dark:bg-black/30 p-4 rounded-lg flex flex-col items-center justify-center">
            <SensorLabel
              icon={<Thermometer className="text-cyan-700 dark:text-cyan-300 w-5 h-5 mr-2" />}
              label="Air Temperature"
            />
            <SensorValue value={sensorData.temperature} unit="°C" />
          </div>

          {/* Humidity */}
          <div className="bg-white/30 dark:bg-black/30 p-4 rounded-lg flex flex-col items-center justify-center">
            <SensorLabel
              icon={<Droplet className="text-blue-700 dark:text-blue-300 w-5 h-5 mr-2" />}
              label="Humidity"
              textColor="text-blue-700 dark:text-blue-300"
            />
            <SensorValue value={sensorData.humidity} unit="%" textColor="text-blue-900 dark:text-blue-100" />
          </div>
        </div>

        <CardFooter>
          <FooterItem icon={<History className="w-4 h-4 mr-1" />}>Update: {getCurrentTime()}</FooterItem>
          <FooterItem icon={<BatteryMedium className="w-4 h-4 mr-1" />}>
            Status: <span className="font-medium ml-1">Active</span>
          </FooterItem>
        </CardFooter>
      </SensorCard>

      {/* Wind Speed Card */}
      <SensorCard
        title={
          <>
            <Wind className="inline mr-2" /> Wind Speed
          </>
        }
        sensorType="Anemometer"
        gradient="bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900 dark:to-green-800"
      >
        <div className="flex flex-col items-center justify-center py-6 flex-grow w-full">
          <WindIndicator windSpeed={sensorData.windSpeed} size={140} />
          <div className="text-lg font-medium text-emerald-800 dark:text-emerald-200 mt-4 flex items-center">
            <span>{sensorData.windUnit}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleWindUnit}
              className="ml-2 text-sm bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 rounded-full"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardFooter>
          <FooterItem icon={<ArrowUp className="w-4 h-4 mr-1" />}>
            Max: {sensorData.windMax} {sensorData.windUnit}
          </FooterItem>
          <FooterItem icon={<ArrowDown className="w-4 h-4 mr-1" />}>
            Min: {sensorData.windMin} {sensorData.windUnit}
          </FooterItem>
        </CardFooter>
      </SensorCard>

      {/* Soil Moisture Card */}
      <SensorCard
        title={
          <>
            <Seedling className="inline mr-2" /> Soil Moisture
          </>
        }
        sensorType="Capacitive v2.0"
        gradient="bg-gradient-to-br from-teal-100 to-cyan-200 dark:from-teal-900 dark:to-cyan-800"
      >
        <div className="flex flex-col items-center justify-center flex-grow w-full py-4">
          {/* Moisture Level Indicator */}
          <div className="w-full bg-white/30 dark:bg-black/30 rounded-full h-8 mb-6">
            <div
              className="h-8 rounded-full bg-teal-600 dark:bg-teal-500 transition-all duration-500"
              style={{ width: `${sensorData.soilMoisture}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <div className="text-center">
              <SensorValue value={sensorData.soilMoisture} unit="%" textColor="text-teal-900 dark:text-teal-100" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium px-4 py-2 bg-white/30 dark:bg-black/30 rounded-full text-teal-900 dark:text-teal-100 flex items-center justify-center">
                {renderSoilStatusIcon()}
                {sensorData.soilStatus}
              </div>
              <div className="text-xs text-teal-800 dark:text-teal-200 mt-2 flex items-center justify-center">
                <History className="w-3 h-3 mr-1" /> {getCurrentTime()}
              </div>
            </div>
          </div>
        </div>

        <CardFooter>
          <FooterItem icon={<ThermometerSnowflake className="w-4 h-4 mr-1" />}>
            Soil Temp: {sensorData.soilTemp}°C
          </FooterItem>
          <FooterItem icon={<BatteryMedium className="w-4 h-4 mr-1" />}>Power: 85%</FooterItem>
        </CardFooter>
      </SensorCard>
    </div>
  )
}
