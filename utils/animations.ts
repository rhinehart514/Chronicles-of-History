// Animation utilities for smooth UI transitions

export interface AnimationConfig {
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
}

export type EasingFunction = (t: number) => number;

// Easing functions
export const easings = {
  // Basic
  linear: (t: number) => t,

  // Quadratic
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,

  // Cubic
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // Quartic
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,

  // Elastic
  easeOutElastic: (t: number) => {
    const p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },

  // Bounce
  easeOutBounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },

  // Back
  easeOutBack: (t: number) => {
    const s = 1.70158;
    return (t = t - 1) * t * ((s + 1) * t + s) + 1;
  }
};

// Animate a value from start to end
export function animate(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  config: AnimationConfig = {}
): () => void {
  const { duration = 300, easing = easings.easeOutQuad, delay = 0 } = config;

  let startTime: number | null = null;
  let animationFrame: number;

  const step = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp + delay;
    }

    const elapsed = timestamp - startTime;

    if (elapsed < 0) {
      animationFrame = requestAnimationFrame(step);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const value = from + (to - from) * easedProgress;

    onUpdate(value);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  };

  animationFrame = requestAnimationFrame(step);

  // Return cancel function
  return () => cancelAnimationFrame(animationFrame);
}

// Animate multiple values
export function animateValues(
  from: Record<string, number>,
  to: Record<string, number>,
  onUpdate: (values: Record<string, number>) => void,
  config: AnimationConfig = {}
): () => void {
  const { duration = 300, easing = easings.easeOutQuad, delay = 0 } = config;

  let startTime: number | null = null;
  let animationFrame: number;

  const step = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp + delay;
    }

    const elapsed = timestamp - startTime;

    if (elapsed < 0) {
      animationFrame = requestAnimationFrame(step);
      return;
    }

    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);

    const values: Record<string, number> = {};
    for (const key of Object.keys(from)) {
      values[key] = from[key] + (to[key] - from[key]) * easedProgress;
    }

    onUpdate(values);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  };

  animationFrame = requestAnimationFrame(step);

  return () => cancelAnimationFrame(animationFrame);
}

// Spring animation
export function spring(
  target: number,
  onUpdate: (value: number) => void,
  config: { stiffness?: number; damping?: number; mass?: number; precision?: number } = {}
): () => void {
  const { stiffness = 100, damping = 10, mass = 1, precision = 0.01 } = config;

  let current = 0;
  let velocity = 0;
  let animationFrame: number;
  let lastTime = performance.now();

  const step = (timestamp: number) => {
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.064); // Cap at ~15fps min
    lastTime = timestamp;

    const springForce = -stiffness * (current - target);
    const dampingForce = -damping * velocity;
    const acceleration = (springForce + dampingForce) / mass;

    velocity += acceleration * deltaTime;
    current += velocity * deltaTime;

    onUpdate(current);

    // Check if settled
    if (Math.abs(current - target) < precision && Math.abs(velocity) < precision) {
      onUpdate(target);
      return;
    }

    animationFrame = requestAnimationFrame(step);
  };

  animationFrame = requestAnimationFrame(step);

  return () => cancelAnimationFrame(animationFrame);
}

// Typewriter effect
export function typewriter(
  text: string,
  onUpdate: (text: string) => void,
  config: { speed?: number; delay?: number } = {}
): () => void {
  const { speed = 50, delay = 0 } = config;

  let index = 0;
  let timeout: NodeJS.Timeout;

  const type = () => {
    if (index <= text.length) {
      onUpdate(text.slice(0, index));
      index++;
      timeout = setTimeout(type, speed);
    }
  };

  timeout = setTimeout(type, delay);

  return () => clearTimeout(timeout);
}

// Counter animation
export function counter(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  config: AnimationConfig & { format?: (n: number) => string } = {}
): () => void {
  return animate(from, to, (value) => {
    onUpdate(Math.round(value));
  }, config);
}

// Stagger animations
export function stagger(
  items: any[],
  onItem: (item: any, index: number) => void,
  config: { staggerDelay?: number; initialDelay?: number } = {}
): () => void {
  const { staggerDelay = 50, initialDelay = 0 } = config;

  const timeouts: NodeJS.Timeout[] = [];

  items.forEach((item, index) => {
    const timeout = setTimeout(() => {
      onItem(item, index);
    }, initialDelay + index * staggerDelay);
    timeouts.push(timeout);
  });

  return () => timeouts.forEach(clearTimeout);
}

// Shake animation (for errors)
export function shake(
  element: HTMLElement,
  config: { intensity?: number; duration?: number } = {}
): void {
  const { intensity = 5, duration = 500 } = config;

  const keyframes = [
    { transform: 'translateX(0)' },
    { transform: `translateX(-${intensity}px)` },
    { transform: `translateX(${intensity}px)` },
    { transform: `translateX(-${intensity}px)` },
    { transform: `translateX(${intensity}px)` },
    { transform: 'translateX(0)' }
  ];

  element.animate(keyframes, { duration, easing: 'ease-in-out' });
}

// Pulse animation
export function pulse(
  element: HTMLElement,
  config: { scale?: number; duration?: number } = {}
): void {
  const { scale = 1.05, duration = 300 } = config;

  element.animate([
    { transform: 'scale(1)' },
    { transform: `scale(${scale})` },
    { transform: 'scale(1)' }
  ], { duration, easing: 'ease-in-out' });
}

// Fade in animation
export function fadeIn(
  element: HTMLElement,
  config: { duration?: number; delay?: number } = {}
): Animation {
  const { duration = 300, delay = 0 } = config;

  return element.animate([
    { opacity: 0 },
    { opacity: 1 }
  ], { duration, delay, fill: 'forwards' });
}

// Slide in animation
export function slideIn(
  element: HTMLElement,
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  config: { distance?: number; duration?: number } = {}
): Animation {
  const { distance = 20, duration = 300 } = config;

  const transforms = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`
  };

  return element.animate([
    { opacity: 0, transform: transforms[direction] },
    { opacity: 1, transform: 'translate(0)' }
  ], { duration, fill: 'forwards', easing: 'ease-out' });
}

// Request animation frame with cleanup
export function raf(callback: (timestamp: number) => boolean | void): () => void {
  let animationFrame: number;
  let running = true;

  const loop = (timestamp: number) => {
    if (!running) return;

    const shouldContinue = callback(timestamp);

    if (shouldContinue !== false) {
      animationFrame = requestAnimationFrame(loop);
    }
  };

  animationFrame = requestAnimationFrame(loop);

  return () => {
    running = false;
    cancelAnimationFrame(animationFrame);
  };
}

export default {
  easings,
  animate,
  animateValues,
  spring,
  typewriter,
  counter,
  stagger,
  shake,
  pulse,
  fadeIn,
  slideIn,
  raf
};
