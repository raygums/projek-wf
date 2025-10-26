import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import './PDFViewer.css';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PDFViewer({ pdfUrl, onClose }) {
    const [pdf, setPdf] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [scale, setScale] = useState(1.5);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        loadPDF();
        
        // Add keyboard shortcuts
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowLeft') {
                goToPrevPage();
            } else if (e.key === 'ArrowRight') {
                goToNextPage();
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [pdfUrl, currentPage]);

    useEffect(() => {
        if (pdf) {
            renderPage(currentPage);
        }
    }, [pdf, currentPage, scale]);

    const loadPDF = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Use proxy if URL is from external domain
            let finalUrl = pdfUrl;
            
            // Check if it's an external URL (not from our server)
            if (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://')) {
                // Use backend proxy to avoid CORS
                finalUrl = `http://localhost:8000/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`;
            }
            
            const loadingTask = pdfjsLib.getDocument({
                url: finalUrl,
                withCredentials: false
            });
            const loadedPdf = await loadingTask.promise;
            
            setPdf(loadedPdf);
            setTotalPages(loadedPdf.numPages);
            setLoading(false);
        } catch (err) {
            console.error('Error loading PDF:', err);
            setError('Gagal memuat PDF. Pastikan URL PDF valid dan dapat diakses.');
            setLoading(false);
        }
    };

    const renderPage = async (pageNum) => {
        if (!pdf) return;

        try {
            const page = await pdf.getPage(pageNum);
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            const viewport = page.getViewport({ scale });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;
        } catch (err) {
            console.error('Error rendering page:', err);
            setError('Gagal menampilkan halaman PDF.');
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const zoomIn = () => {
        setScale(prevScale => Math.min(prevScale + 0.25, 3));
    };

    const zoomOut = () => {
        setScale(prevScale => Math.max(prevScale - 0.25, 0.5));
    };

    const goToPage = (e) => {
        const pageNum = parseInt(e.target.value);
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    return (
        <div className="pdf-viewer-overlay">
            <div className="pdf-viewer-container">
                {/* Header Controls */}
                <div className="pdf-viewer-header">
                    <div className="pdf-viewer-title">
                        <h2>Baca Buku Online</h2>
                    </div>
                    
                    <div className="pdf-viewer-controls">
                        {/* Page Navigation */}
                        <div className="page-controls">
                            <button 
                                onClick={goToPrevPage} 
                                disabled={currentPage <= 1}
                                className="control-btn"
                                title="Halaman Sebelumnya"
                            >
                                ‹
                            </button>
                            
                            <div className="page-info">
                                <input 
                                    type="number" 
                                    value={currentPage}
                                    onChange={goToPage}
                                    min="1"
                                    max={totalPages}
                                    className="page-input"
                                />
                                <span> / {totalPages}</span>
                            </div>
                            
                            <button 
                                onClick={goToNextPage} 
                                disabled={currentPage >= totalPages}
                                className="control-btn"
                                title="Halaman Berikutnya"
                            >
                                ›
                            </button>
                        </div>

                        {/* Zoom Controls */}
                        <div className="zoom-controls">
                            <button 
                                onClick={zoomOut} 
                                disabled={scale <= 0.5}
                                className="control-btn"
                                title="Perkecil"
                            >
                                −
                            </button>
                            <span className="zoom-level">{Math.round(scale * 100)}%</span>
                            <button 
                                onClick={zoomIn} 
                                disabled={scale >= 3}
                                className="control-btn"
                                title="Perbesar"
                            >
                                +
                            </button>
                        </div>

                        {/* Close Button */}
                        <button onClick={onClose} className="close-btn" title="Tutup">
                            ✕
                        </button>
                    </div>
                </div>

                {/* PDF Content */}
                <div className="pdf-viewer-content">
                    {loading && (
                        <div className="pdf-loading">
                            <div className="spinner"></div>
                            <p>Memuat PDF...</p>
                        </div>
                    )}

                    {error && (
                        <div className="pdf-error">
                            <p>{error}</p>
                            <button onClick={loadPDF} className="retry-btn">
                                Coba Lagi
                            </button>
                            <a 
                                href={pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="retry-btn"
                                style={{ marginTop: '10px', textDecoration: 'none' }}
                            >
                                Buka di Tab Baru
                            </a>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="pdf-canvas-container">
                            <canvas ref={canvasRef} className="pdf-canvas"></canvas>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="pdf-viewer-footer">
                    <span>Gunakan tombol navigasi untuk berpindah halaman</span>
                    <span>Tekan ESC untuk keluar</span>
                </div>
            </div>
        </div>
    );
}

export default PDFViewer;
