'use client'

import { useState, useEffect } from 'react'
import { 
  Globe, 
  Monitor, 
  Link as LinkIcon, 
  Code, 
  Lock,
  Wifi,
  Server,
  Search,
  FileJson,
  Binary,
  Hash,
  Mail,
  MapPin,
  Clock,
  Languages
} from 'lucide-react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('ip')
  const [ipInfo, setIpInfo] = useState<any>(null)
  const [browserInfo, setBrowserInfo] = useState<any>(null)
  const [urlInput, setUrlInput] = useState('')
  const [urlDecoded, setUrlDecoded] = useState('')
  const [urlEncoded, setUrlEncoded] = useState('')
  const [jsonInput, setJsonInput] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [base64Input, setBase64Input] = useState('')
  const [base64Output, setBase64Output] = useState('')
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode')
  const [hashInput, setHashInput] = useState('')
  const [hashOutputs, setHashOutputs] = useState<any>({})

  useEffect(() => {
    // Get IP info
    fetch('/api/ip')
      .then(res => res.json())
      .then(data => setIpInfo(data))
      .catch(err => console.error(err))

    // Get browser info
    const nav = navigator as any
    const browserData = {
      userAgent: nav.userAgent,
      platform: nav.platform,
      language: nav.language,
      languages: nav.languages?.join(', '),
      online: nav.onLine,
      cookieEnabled: nav.cookieEnabled,
      doNotTrack: nav.doNotTrack,
      maxTouchPoints: nav.maxTouchPoints,
      hardwareConcurrency: nav.hardwareConcurrency,
      deviceMemory: nav.deviceMemory,
      vendor: nav.vendor,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight,
        colorDepth: window.screen.colorDepth,
        pixelDepth: window.screen.pixelDepth,
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
    }
    setBrowserInfo(browserData)
  }, [])

  const handleUrlEncode = (text: string) => {
    setUrlInput(text)
    try {
      setUrlEncoded(encodeURIComponent(text))
      setUrlDecoded(text)
    } catch (e) {
      setUrlEncoded('Invalid input')
    }
  }

  const handleUrlDecode = (text: string) => {
    try {
      const decoded = decodeURIComponent(text)
      setUrlDecoded(decoded)
      setUrlInput(decoded)
    } catch (e) {
      setUrlDecoded('Invalid encoded URL')
    }
  }

  const handleJsonFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonOutput(JSON.stringify(parsed, null, 2))
      setJsonError('')
    } catch (e: any) {
      setJsonError(e.message)
      setJsonOutput('')
    }
  }

  const handleJsonMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput)
      setJsonOutput(JSON.stringify(parsed))
      setJsonError('')
    } catch (e: any) {
      setJsonError(e.message)
      setJsonOutput('')
    }
  }

  const handleBase64 = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input))
      } else {
        setBase64Output(atob(base64Input))
      }
    } catch (e) {
      setBase64Output('Error: Invalid input')
    }
  }

  const handleHash = async () => {
    const encoder = new TextEncoder()
    const data = encoder.encode(hashInput)
    
    try {
      const sha1 = await crypto.subtle.digest('SHA-1', data)
      const sha256 = await crypto.subtle.digest('SHA-256', data)
      const sha384 = await crypto.subtle.digest('SHA-384', data)
      const sha512 = await crypto.subtle.digest('SHA-512', data)
      
      const hexString = (buffer: ArrayBuffer) => {
        const hashArray = Array.from(new Uint8Array(buffer))
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      }
      
      setHashOutputs({
        sha1: hexString(sha1),
        sha256: hexString(sha256),
        sha384: hexString(sha384),
        sha512: hexString(sha512),
      })
    } catch (e) {
      console.error(e)
    }
  }

  const tools = [
    { id: 'ip', name: 'IP Information', icon: Wifi },
    { id: 'browser', name: 'Browser Info', icon: Monitor },
    { id: 'url', name: 'URL Encoder/Decoder', icon: LinkIcon },
    { id: 'json', name: 'JSON Formatter', icon: FileJson },
    { id: 'base64', name: 'Base64 Encoder/Decoder', icon: Binary },
    { id: 'hash', name: 'Hash Generator', icon: Hash },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Web Info Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your comprehensive web information and utilities toolkit
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            by Karthik Penumala
          </p>
        </header>

        <div className="grid md:grid-cols-6 gap-4 mb-8">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTab(tool.id)}
                className={`p-4 rounded-lg transition-all ${
                  activeTab === tool.id
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <span className="text-xs font-medium">{tool.name}</span>
              </button>
            )
          })}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {activeTab === 'ip' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <Wifi className="w-8 h-8" />
                IP Information
              </h2>
              {ipInfo ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <InfoCard label="IP Address" value={ipInfo.ip} icon={<Server />} />
                  <InfoCard label="City" value={ipInfo.city} icon={<MapPin />} />
                  <InfoCard label="Region" value={ipInfo.region} icon={<MapPin />} />
                  <InfoCard label="Country" value={ipInfo.country} icon={<Globe />} />
                  <InfoCard label="Timezone" value={ipInfo.timezone} icon={<Clock />} />
                  <InfoCard label="ISP" value={ipInfo.org} icon={<Server />} />
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">Loading IP information...</p>
              )}
            </div>
          )}

          {activeTab === 'browser' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <Monitor className="w-8 h-8" />
                Browser Information
              </h2>
              {browserInfo && (
                <div className="space-y-4">
                  <InfoCard label="User Agent" value={browserInfo.userAgent} />
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoCard label="Platform" value={browserInfo.platform} icon={<Monitor />} />
                    <InfoCard label="Language" value={browserInfo.language} icon={<Languages />} />
                    <InfoCard label="All Languages" value={browserInfo.languages} />
                    <InfoCard label="Vendor" value={browserInfo.vendor} />
                    <InfoCard label="Online Status" value={browserInfo.online ? 'Online' : 'Offline'} icon={<Wifi />} />
                    <InfoCard label="Cookies Enabled" value={browserInfo.cookieEnabled ? 'Yes' : 'No'} />
                    <InfoCard label="Do Not Track" value={browserInfo.doNotTrack || 'Not set'} />
                    <InfoCard label="Max Touch Points" value={browserInfo.maxTouchPoints} />
                    <InfoCard label="CPU Cores" value={browserInfo.hardwareConcurrency} />
                    <InfoCard label="Device Memory" value={browserInfo.deviceMemory ? `${browserInfo.deviceMemory} GB` : 'N/A'} />
                    <InfoCard label="Timezone" value={browserInfo.timezone} icon={<Clock />} />
                    <InfoCard label="Timezone Offset" value={`${browserInfo.timezoneOffset} minutes`} />
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Screen Information</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <InfoCard label="Width" value={`${browserInfo.screen.width}px`} />
                      <InfoCard label="Height" value={`${browserInfo.screen.height}px`} />
                      <InfoCard label="Available Width" value={`${browserInfo.screen.availWidth}px`} />
                      <InfoCard label="Available Height" value={`${browserInfo.screen.availHeight}px`} />
                      <InfoCard label="Color Depth" value={`${browserInfo.screen.colorDepth}-bit`} />
                      <InfoCard label="Pixel Depth" value={`${browserInfo.screen.pixelDepth}-bit`} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'url' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <LinkIcon className="w-8 h-8" />
                URL Encoder/Decoder
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Enter URL or Text
                  </label>
                  <textarea
                    value={urlInput}
                    onChange={(e) => handleUrlEncode(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Enter text to encode..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Encoded URL
                  </label>
                  <textarea
                    value={urlEncoded}
                    readOnly
                    className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Paste Encoded URL to Decode
                  </label>
                  <textarea
                    onChange={(e) => handleUrlDecode(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    placeholder="Paste encoded URL..."
                  />
                </div>
                {urlDecoded && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Decoded Result
                    </label>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-gray-800 dark:text-white">
                      {urlDecoded}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <FileJson className="w-8 h-8" />
                JSON Formatter & Validator
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Paste JSON
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                    rows={8}
                    placeholder='{"key": "value"}'
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleJsonFormat}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    Format (Pretty)
                  </button>
                  <button
                    onClick={handleJsonMinify}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Minify
                  </button>
                </div>
                {jsonError && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                    Error: {jsonError}
                  </div>
                )}
                {jsonOutput && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Output
                    </label>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg overflow-x-auto text-sm dark:text-white">
                      {jsonOutput}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'base64' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <Binary className="w-8 h-8" />
                Base64 Encoder/Decoder
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => setBase64Mode('encode')}
                    className={`px-6 py-2 rounded-lg transition ${
                      base64Mode === 'encode'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => setBase64Mode('decode')}
                    className={`px-6 py-2 rounded-lg transition ${
                      base64Mode === 'decode'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Decode
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Input
                  </label>
                  <textarea
                    value={base64Input}
                    onChange={(e) => setBase64Input(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                    rows={6}
                    placeholder={base64Mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  />
                </div>
                <button
                  onClick={handleBase64}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {base64Mode === 'encode' ? 'Encode' : 'Decode'}
                </button>
                {base64Output && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Output
                    </label>
                    <pre className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg overflow-x-auto text-sm dark:text-white">
                      {base64Output}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'hash' && (
            <div>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-white">
                <Hash className="w-8 h-8" />
                Hash Generator
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Enter Text
                  </label>
                  <textarea
                    value={hashInput}
                    onChange={(e) => setHashInput(e.target.value)}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={4}
                    placeholder="Enter text to hash..."
                  />
                </div>
                <button
                  onClick={handleHash}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Generate Hashes
                </button>
                {hashOutputs.sha256 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        SHA-1
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg font-mono text-xs break-all dark:text-white">
                        {hashOutputs.sha1}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        SHA-256
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg font-mono text-xs break-all dark:text-white">
                        {hashOutputs.sha256}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        SHA-384
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg font-mono text-xs break-all dark:text-white">
                        {hashOutputs.sha384}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        SHA-512
                      </label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-900 border rounded-lg font-mono text-xs break-all dark:text-white">
                        {hashOutputs.sha512}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p className="text-sm">
            © 2025 Web Info Hub by Karthik Penumala. All web information tools in one place.
          </p>
        </footer>
      </div>
    </main>
  )
}

function InfoCard({ label, value, icon }: { label: string; value: any; icon?: React.ReactNode }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
        {icon && <span className="w-4 h-4">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
      <p className="text-gray-900 dark:text-white font-semibold break-all">{value || 'N/A'}</p>
    </div>
  )
}
