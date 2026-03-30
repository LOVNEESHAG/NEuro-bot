import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import api from '../utils/api';

export default function VoiceRecorder() {
  const { t } = useTranslation();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      alert('Microphone access is required for voice recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const uploadAndAnalyze = async () => {
    if (!audioBlob) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('durationSeconds', duration);
      const { data } = await api.post('/voice/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--page-gradient)', padding: '100px 20px 40px'
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card" style={{ maxWidth: 500, width: '100%', padding: 40, textAlign: 'center' }}>
        
        {result ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Lora, serif', color: 'var(--primary-dark)', marginBottom: 16 }}>Recording Analyzed</h2>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <div className="badge badge-minimal">{result.emotionalTone || 'Analyzed'}</div>
              <div className="badge" style={{ background: 'var(--badge-bg-default)' }}>{duration}s</div>
            </div>
            {result.riskFlags?.length > 0 && (
              <div style={{ textAlign: 'left', marginBottom: 16 }}>
                <p style={{ fontWeight: 600, marginBottom: 8 }}>Observations:</p>
                {result.riskFlags.map((flag, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span>•</span><span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { setResult(null); setAudioBlob(null); setDuration(0); }}
              className="btn-secondary" style={{ width: '100%' }}>Record Another</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{recording ? '🔴' : '🎙️'}</div>
            <h2 style={{ fontFamily: 'Lora, serif', color: 'var(--primary-dark)', marginBottom: 8 }}>{t('voice.title')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 30 }}>{t('voice.subtitle')}</p>

            {/* Timer */}
            <div style={{
              fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Lora, serif',
              color: recording ? 'var(--danger)' : 'var(--primary)',
              marginBottom: 30
            }}>
              {formatTime(duration)}
            </div>

            {/* Waveform visualization */}
            {recording && (
              <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 30, height: 40, alignItems: 'center' }}>
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div key={i}
                    animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                    style={{ width: 4, borderRadius: 99, background: 'var(--secondary)' }}
                  />
                ))}
              </div>
            )}

            {/* Controls */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {!recording && !audioBlob && (
                <button onClick={startRecording} className="btn-primary"
                  style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
                  {t('voice.start_recording')}
                </button>
              )}
              {recording && (
                <button onClick={stopRecording} className="btn-accent"
                  style={{ padding: '16px 48px', fontSize: '1.1rem' }}>
                  {t('voice.stop_recording')}
                </button>
              )}
              {audioBlob && !recording && (
                <>
                  <button onClick={uploadAndAnalyze} className="btn-primary"
                    disabled={uploading} style={{ padding: '16px 48px', opacity: uploading ? 0.7 : 1 }}>
                    {uploading ? t('voice.processing') : t('voice.upload')}
                  </button>
                  <button onClick={() => { setAudioBlob(null); setDuration(0); }}
                    className="btn-secondary" style={{ padding: '16px 24px' }}>
                    Retry
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
