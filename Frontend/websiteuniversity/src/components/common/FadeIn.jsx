/**
 * Wraps content in a subtle fade/slide-in. Used two ways:
 *  1. Around <Routes> (keyed by pathname) for smooth page-to-page transitions.
 *  2. Around any block whose "loading" prop flips from true -> false, so the
 *     real content fades in instead of popping in the instant a fetch resolves.
 */
export default function FadeIn({ children, loading = false, skeleton = null, className = "" }) {
  if (loading) return skeleton;
  return <div className={`fade-in ${className}`.trim()}>{children}</div>;
}
