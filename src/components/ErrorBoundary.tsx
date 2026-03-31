import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public props: ErrorBoundaryProps;
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#0a0a0a',
          color: 'white',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif'
        }}>
          <h1 style={{ color: '#582ef5', marginBottom: '1rem' }}>Oops! Algo deu errado.</h1>
          <p style={{ color: '#888', marginBottom: '2rem' }}>Ocorreu um erro ao carregar a página.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#582ef5',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
          <pre style={{ 
            marginTop: '2rem', 
            textAlign: 'left', 
            fontSize: '0.75rem', 
            color: '#444',
            maxWidth: '80%',
            overflow: 'auto'
          }}>
            {this.state.error?.message}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
