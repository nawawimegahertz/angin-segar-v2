"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import SensorCards from "@/components/sensor-cards"
import AdditionalInfo from "@/components/additional-info"
import Footer from "@/components/footer"

export default function Dashboard() {
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const [sensorData, setSensorData] = useState({
    temperature: "--",
    humidity: "--",
    windSpeed: "--",
    windUnit: "km/h",
    windMax: "--",
    windMin: "--",
    soilMoisture: "--",
    soilTemp: "--",
    soilStatus: "Measuring...",
    soilStatusIcon: "spinner",
  })
  const [alarmPlaying, setAlarmPlaying] = useState(false)

  // Initialize audio element
  useEffect(() => {
    // Create audio element only on client side
    audioRef.current = new Audio("/alarm.mp3")
    audioRef.current.addEventListener("error", (e) => {
      console.log("Audio error:", e)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Generate random sensor data
  const generateSensorData = () => {
    // Temperature data (15-35°C)
    const temperature = (Math.random() * 20 + 15).toFixed(1)

    // Humidity data (30-90%)
    const humidity = (Math.random() * 60 + 30).toFixed(1)

    // Wind speed data (0-30 km/h)
    const windSpeed = (Math.random() * 30).toFixed(1)
    const windMax = (Number.parseFloat(windSpeed) + 5).toFixed(1)
    const windMin = Math.max(0, Number.parseFloat(windSpeed) - 3).toFixed(1)

    // Soil moisture data (0-100%)
    const soilMoisture = (Math.random() * 100).toFixed(1)

    // Soil status
    let soilStatus, soilStatusIcon
    if (Number.parseFloat(soilMoisture) < 20) {
      soilStatus = "Very Dry"
      soilStatusIcon = "alert-triangle"
    } else if (Number.parseFloat(soilMoisture) < 40) {
      soilStatus = "Dry"
      soilStatusIcon = "droplet-off"
    } else if (Number.parseFloat(soilMoisture) < 60) {
      soilStatus = "Normal"
      soilStatusIcon = "check-circle"
    } else if (Number.parseFloat(soilMoisture) < 80) {
      soilStatus = "Moist"
      soilStatusIcon = "droplet"
    } else {
      soilStatus = "Very Wet"
      soilStatusIcon = "umbrella"
    }

    // Soil temperature (10-30°C)
    const soilTemp = (Math.random() * 20 + 10).toFixed(1)

    // Check for unstable conditions and trigger alarm/toast
    checkUnstableConditions(temperature, humidity, windSpeed)

    setSensorData({
      temperature,
      humidity,
      windSpeed,
      windUnit: sensorData.windUnit,
      windMax,
      windMin,
      soilMoisture,
      soilTemp,
      soilStatus,
      soilStatusIcon,
    })
  }

  // Check for unstable conditions
  const checkUnstableConditions = (temperature, humidity, windSpeed) => {
    const tempNum = Number.parseFloat(temperature)
    const humidityNum = Number.parseFloat(humidity)
    const windNum = Number.parseFloat(windSpeed)

    let alarmTriggered = false

    // Check temperature (too hot)
    if (tempNum > 30) {
      toast({
        title: "Temperature Warning",
        description: `Temperature too high: ${temperature}°C`,
        variant: "destructive",
      })
      alarmTriggered = true
    }

    // Check humidity (too wet or too dry)
    if (humidityNum > 80) {
      toast({
        title: "Humidity Warning",
        description: `Humidity too high: ${humidity}%`,
        variant: "destructive",
      })
      alarmTriggered = true
    } else if (humidityNum < 40) {
      toast({
        title: "Humidity Warning",
        description: `Humidity too low: ${humidity}%`,
        variant: "destructive",
      })
      alarmTriggered = true
    }

    // Check wind speed (too fast)
    if (windNum > 20) {
      toast({
        title: "Wind Speed Warning",
        description: `Wind speed too high: ${windSpeed} ${sensorData.windUnit}`,
        variant: "destructive",
      })
      alarmTriggered = true
    }

    // Play alarm if any condition is unstable
    if (alarmTriggered && !alarmPlaying) {
      playAlarm()
    }
  }

  // Play alarm sound
  const playAlarm = () => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((err) => {
          console.error("Error playing audio:", err)
        })
        setAlarmPlaying(true)
      } catch (error) {
        console.error("Error playing alarm:", error)
      }
    }

    // Reset alarm playing state after 5 seconds
    setTimeout(() => {
      stopAlarm()
    }, 5000)
  }

  // Stop alarm sound
  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setAlarmPlaying(false)
  }

  // Toggle wind speed unit
  const toggleWindUnit = () => {
    const { windSpeed, windMax, windMin, windUnit } = sensorData

    if (windUnit === "km/h") {
      // Convert to m/s
      setSensorData({
        ...sensorData,
        windSpeed: (Number.parseFloat(windSpeed) / 3.6).toFixed(1),
        windMax: (Number.parseFloat(windMax) / 3.6).toFixed(1),
        windMin: (Number.parseFloat(windMin) / 3.6).toFixed(1),
        windUnit: "m/s",
      })
    } else {
      // Convert to km/h
      setSensorData({
        ...sensorData,
        windSpeed: (Number.parseFloat(windSpeed) * 3.6).toFixed(1),
        windMax: (Number.parseFloat(windMax) * 3.6).toFixed(1),
        windMin: (Number.parseFloat(windMin) * 3.6).toFixed(1),
        windUnit: "km/h",
      })
    }
  }

  // Initialize and update data
  useEffect(() => {
    generateSensorData()

    // Update sensor data every 5 seconds (simulate real-time updates)
    const interval = setInterval(generateSensorData, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 dark:from-emerald-950 dark:to-green-900 transition-colors duration-300">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <SensorCards sensorData={sensorData} toggleWindUnit={toggleWindUnit} />
        <AdditionalInfo sensorData={sensorData} />
      </main>

      <Footer />
      <Toaster />
    </div>
  )
}
