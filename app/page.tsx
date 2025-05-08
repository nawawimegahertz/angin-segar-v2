"use client"

import { useState, useEffect, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/header"
import SensorCards from "@/components/sensor-cards"
import AdditionalInfo from "@/components/additional-info"
import Footer from "@/components/footer"

// Konfigurasi ThingSpeak
const THINGSPEAK_CHANNEL_ID = "2953765"
const THINGSPEAK_API_KEY = "6097IQQ68AH3RF5N"
const THINGSPEAK_API_URL = `https://api.thingspeak.com/channels/2621036/feeds/last.json?api_key=GGSK06LEDQOICPMJ`

interface SensorData {
  temperature: string
  humidity: string
  windSpeed: string
  windUnit: "km/h" | "m/s"
  windMax: string
  windMin: string
  soilMoisture: string
  soilTemp: string
  soilStatus: string
  soilStatusIcon: string
}

export default function Dashboard() {
  const { toast } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [sensorData, setSensorData] = useState<SensorData>({
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
    audioRef.current = new Audio("/alarm.mp3")
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Fetch data dari ThingSpeak
  const fetchSensorData = async () => {
    try {
      const response = await fetch(THINGSPEAK_API_URL)
      if (!response.ok) throw new Error("Gagal mengambil data")
      
      const data = await response.json()
      
      // Parse dan format data
      const tempValue = parseFloat(data.field1 || "0")
      const temperature = isNaN(tempValue) ? "--" : Math.round(tempValue).toString()

      const humValue = parseFloat(data.field2 || "0")
      const humidity = isNaN(humValue) ? "--" : Math.round(humValue).toString()

      const windSpeedMps = data.field3 || "0"
      const windSpeedMpsValue = parseFloat(windSpeedMps)
      const windSpeed = isNaN(windSpeedMpsValue) ? "0" : Math.round(windSpeedMpsValue * 3.6).toString()

      const soilMoistValue = parseFloat(data.field4 || "0")
      const soilMoisture = isNaN(soilMoistValue) ? "--" : Math.round(soilMoistValue).toString()

      // Update status tanah
      const { soilStatus, soilStatusIcon } = getSoilStatus(parseFloat(soilMoisture))

      // Update state
      setSensorData(prev => ({
        ...prev,
        temperature,
        humidity,
        windSpeed,
        soilMoisture,
        soilStatus,
        soilStatusIcon,
        soilTemp: "25" // Update ke integer
      }))

      // Check kondisi bahaya
      checkUnstableConditions(temperature, humidity, windSpeed)
      
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Koneksi Error",
        description: "Gagal mengambil data dari sensor",
        variant: "destructive"
      })
    }
  }

  // Toggle satuan kecepatan angin (diupdate untuk integer)
  const toggleWindUnit = () => {
    const { windSpeed, windUnit } = sensorData
    const currentSpeed = parseFloat(windSpeed)
    
    if (windUnit === "km/h") {
      const newSpeed = Math.round(currentSpeed / 3.6)
      setSensorData(prev => ({
        ...prev,
        windSpeed: newSpeed.toString(),
        windUnit: "m/s"
      }))
    } else {
      const newSpeed = Math.round(currentSpeed * 3.6)
      setSensorData(prev => ({
        ...prev,
        windSpeed: newSpeed.toString(),
        windUnit: "km/h"
      }))
    }
  }

  /* Fungsi-fungsi lainnya tetap sama */
  // Helper untuk status tanah
  const getSoilStatus = (moisture: number) => {
    if (moisture < 20) return { soilStatus: "Very Dry", soilStatusIcon: "alert-triangle" }
    if (moisture < 40) return { soilStatus: "Dry", soilStatusIcon: "droplet-off" }
    if (moisture < 60) return { soilStatus: "Normal", soilStatusIcon: "check-circle" }
    if (moisture < 80) return { soilStatus: "Moist", soilStatusIcon: "droplet" }
    return { soilStatus: "Very Wet", soilStatusIcon: "umbrella" }
  }

  // Sistem alarm
  const checkUnstableConditions = (temperature: string, humidity: string, windSpeed: string) => {
    const tempNum = Number.parseFloat(temperature)
    const humidityNum = Number.parseFloat(humidity)
    const windNum = Number.parseFloat(windSpeed)

    let alarmTriggered = false

    if (tempNum > 30) {
      toast({ title: "Temperature Warning", description: `Temperature too high: ${temperature}°C`, variant: "destructive" })
      alarmTriggered = true
    }

    if (humidityNum > 80 || humidityNum < 40) {
      toast({ title: "Humidity Warning", description: `Humidity: ${humidity}%`, variant: "destructive" })
      alarmTriggered = true
    }

    if (windNum > 20) {
      toast({ title: "Wind Speed Warning", description: `Wind speed: ${windSpeed} ${sensorData.windUnit}`, variant: "destructive" })
      alarmTriggered = true
    }

    if (alarmTriggered && !alarmPlaying) playAlarm()
  }

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
      setAlarmPlaying(true)
      setTimeout(stopAlarm, 5000)
    }
  }

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setAlarmPlaying(false)
  }

  useEffect(() => {
    fetchSensorData()
    const interval = setInterval(fetchSensorData, 20000)
    return () => clearInterval(interval)
  }, [])

  // JSX tetap sama
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