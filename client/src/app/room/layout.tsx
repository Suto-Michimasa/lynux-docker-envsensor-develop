import React from 'react';
import type { Metadata } from 'next'
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: '研究室 音量可視化',
  description: '研究室の音量を可視化するアプリケーションです',
}

export default function Room({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        {children}
      </div>
    </main>
  )
}