import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

/**
 * HeroErrorBoundary
 * Catches any runtime error thrown by the 3D hero (Three.js / R3F / font load)
 * and renders the fallback (plain typewriter) instead of crashing the page.
 */
export default class HeroErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMsg: error?.message ?? 'Unknown error' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console in dev — silent in prod
    if (import.meta.env.DEV) {
      console.warn('[HeroErrorBoundary] 3D hero failed, showing fallback.', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
