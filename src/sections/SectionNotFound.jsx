/**
 * Rendered when a section declares a `variant` that isn't in the registry.
 * Deliberately visible - a silent blank section is harder to debug than a
 * short message naming the missing variant.
 */
export default function SectionNotFound({ section }) {
  const variant = section?.variant;
  const id = section?.id;

  return (
    <section
      id={id}
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '40vh',
        padding: '48px 24px',
        fontFamily: 'var(--mono)',
        color: 'var(--text-dim)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '24px 32px',
          maxWidth: 520,
        }}
      >
        <p style={{ color: 'var(--accent)', letterSpacing: 2, marginBottom: 12 }}>
          UNKNOWN SECTION VARIANT
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.6 }}>
          Section <strong>{String(id)}</strong> asks for variant{' '}
          <strong>{String(variant)}</strong>, which isn&apos;t registered.
          <br />
          Add it to <code>src/sections/registry.js</code> or change the section&apos;s
          <code> variant</code>.
        </p>
      </div>
    </section>
  );
}
