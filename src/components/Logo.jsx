import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './Logo.module.css';

function LogoSvg() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 154 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g transform="matrix(1,0,0,1,-704.576358,-235.147753)">
        <g>
          <g transform="matrix(1.981892,0,0,2.215611,-713.575475,-391.977932)">
            <path d="M792.754,297.943L792.754,326.829C792.754,334.8 785.519,341.272 776.607,341.272L732.205,341.272C723.294,341.272 716.059,334.8 716.059,326.829L716.059,297.943C716.059,289.972 723.294,283.5 732.205,283.5L776.607,283.5C785.519,283.5 792.754,289.972 792.754,297.943Z" fill="var(--surface)" stroke="var(--text)" strokeWidth="3" />
          </g>
          <g transform="matrix(0.27642,0,0,0.487323,600.67161,111.731339)">
            <path d="M662.003,283.5L724.358,283.5C764.608,283.5 791.826,284.672 806.013,287.015C820.199,289.358 830.988,293.207 838.378,298.563C845.768,303.919 850.387,309.881 852.235,316.45C854.082,323.019 855.006,335.927 855.006,355.174L855.006,426.346C855.006,444.589 853.653,456.786 850.948,462.936C848.243,469.087 843.525,473.899 836.794,477.372C830.064,480.844 821.75,483.271 811.853,484.652C801.955,486.033 787.043,486.723 767.115,486.723L662.003,486.723L662.003,283.5ZM745.341,318.27L745.341,451.953C757.35,451.953 764.74,450.426 767.511,447.371C770.283,444.317 771.668,436.011 771.668,422.455L771.668,343.5C771.668,334.295 771.206,328.396 770.283,325.802C769.359,323.207 767.247,321.304 763.948,320.09C760.649,318.877 754.446,318.27 745.341,318.27Z" fill="var(--accent2)" fillRule="nonzero" />
          </g>
          <g transform="matrix(0.254107,0,0,0.487323,557.897632,111.731339)">
            <path d="M855.541,345.007L771.345,345.007L771.345,329.944C771.345,322.914 770.269,318.437 768.115,316.513C765.962,314.588 762.373,313.626 757.349,313.626C751.893,313.626 747.766,314.924 744.967,317.521C742.168,320.116 740.768,324.052 740.768,329.328C740.768,336.111 742.347,341.22 745.505,344.654C748.52,348.087 757.061,352.228 771.13,357.077C811.469,371.038 836.878,382.496 847.358,391.45C857.838,400.405 863.077,414.84 863.077,434.756C863.077,449.233 860.17,459.903 854.356,466.765C848.542,473.627 837.309,479.38 820.657,484.024C804.004,488.669 784.624,490.991 762.517,490.991C738.256,490.991 717.548,488.313 700.393,482.957C683.238,477.602 672.005,470.782 666.693,462.497C661.381,454.212 658.726,442.455 658.726,427.225L658.726,413.919L742.921,413.919L742.921,438.647C742.921,446.263 744.106,451.158 746.474,453.334C748.843,455.509 753.042,456.597 759.071,456.597C765.101,456.597 769.587,455.217 772.53,452.455C775.472,449.694 776.944,445.593 776.944,440.154C776.944,428.187 774.145,420.363 768.546,416.681C762.804,412.999 748.663,406.848 726.125,398.229C703.587,389.526 688.657,383.208 681.336,379.275C674.014,375.342 667.949,369.902 663.14,362.957C658.331,356.011 655.926,347.141 655.926,336.346C655.926,320.781 659.336,309.4 666.155,302.203C672.974,295.006 683.992,289.379 699.208,285.32C714.425,281.261 732.801,279.232 754.334,279.232C777.877,279.232 797.939,281.45 814.52,285.885C831.1,290.32 842.082,295.906 847.466,302.642C852.849,309.379 855.541,320.822 855.541,336.973L855.541,345.007Z" fill="var(--accent)" fillRule="nonzero" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default function Logo({ onClick, mobile = false, className = '' }) {
  const containerRef = useRef(null);
  const text1Ref = useRef(null);
  const text2Ref = useRef(null);
  const tweens = useRef([]);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (mobile || !containerRef.current) return;

    // scope all GSAP to this component's DOM subtree only
    ctxRef.current = gsap.context(() => {
      gsap.set([text1Ref.current, text2Ref.current], { x: -30, opacity: 0 });
    }, containerRef);

    return () => ctxRef.current?.revert();
  }, [mobile]);

  const handleMouseEnter = () => {
    tweens.current.forEach(t => t.kill());
    tweens.current = [
      gsap.to(text1Ref.current, {
        x: 6, opacity: 1,
        duration: 0.45, ease: 'expo.out',
      }),
      gsap.to(text2Ref.current, {
        x: 6, opacity: 1,
        duration: 0.45, ease: 'expo.out',
        delay: 0.08,
      }),
    ];
  };

  const handleMouseLeave = () => {
    tweens.current.forEach(t => t.kill());
    tweens.current = [
      gsap.to(text1Ref.current, {
        x: -30, opacity: 0,
        duration: 0.45, ease: 'expo.out',
      }),
      gsap.to(text2Ref.current, {
        x: -30, opacity: 0,
        duration: 0.45, ease: 'expo.out',
      }),
    ];
  };

  if (mobile) {
    return (
      <span
        className={`${styles.logo} ${styles.mobileLogo} ${className}`}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        aria-label="Home"
      >
        <LogoSvg />
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={`${styles.logo} ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      aria-label="Home"
    >
      <LogoSvg />

      <span className={styles.textClip}>
        <span ref={text1Ref} className={styles.text} style={{ opacity: 0 }}>
          SUMIT
        </span>
      </span>

      <span className={styles.textClip}>
        <span ref={text2Ref} className={styles.text} style={{ opacity: 0 }}>
          <span className={styles.dot}>.</span>DEV
        </span>
      </span>
    </span>
  );
}