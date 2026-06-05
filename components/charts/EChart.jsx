"use client"
import { useEffect, useRef } from 'react'

export default function EChart({ option, className = '', style }) {
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const echartsRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    let disposed = false
    let resizeHandler = null

    import('echarts').then((mod) => {
      if (disposed || !containerRef.current) return

      const echarts = mod.default ?? mod
      echartsRef.current = echarts

      const instance = echarts.init(containerRef.current)
      chartRef.current = instance
      instance.setOption(option, { notMerge: true })

      resizeHandler = () => instance.resize()
      window.addEventListener('resize', resizeHandler)
    })

    return () => {
      disposed = true
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      chartRef.current?.dispose()
      chartRef.current = null
      echartsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge: true })
  }, [option])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', minHeight: 360, ...style }}
    />
  )
}
