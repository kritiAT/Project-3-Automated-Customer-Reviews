import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Full details land in the browser console — check there first when debugging.
    console.error("Render error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-16">
          <p className="font-mono text-xs tracking-[0.2em] text-rust uppercase mb-2">
            Something broke
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink mb-3">
            This page hit an error instead of rendering.
          </h2>
          <p className="text-inkfade mb-4">
            Open the browser console (F12 → Console tab) to see the exact
            error. It's almost always a mismatch between what the API
            returned and what this page expected.
          </p>
          <pre className="font-mono text-xs bg-paper2 border border-line rounded-card p-4 overflow-auto text-rust">
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
