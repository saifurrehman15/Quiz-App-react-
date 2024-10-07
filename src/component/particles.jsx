import React, { useEffect, useRef } from "react";

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create colorful particles with different shapes and rotations
    const createParticles = (numParticles) => {
      for (let i = 0; i < numParticles; i++) {
        const shapeType = Math.random() < 0.33 ? "circle" : Math.random() < 0.5 ? "square" : "triangle"; // Circle, Square, or Triangle
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 15 + 5, // Size of the shape
          borderColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 1)`, // Solid border color
          speed: Math.random() * 0.2 + 0.2, // More dynamic speed
          direction: Math.random() * Math.PI * 2, // Random direction
          shape: shapeType, // Store shape type
          rotation: Math.random() * 360, // Rotation for squares and triangles
          lineWidth: Math.random() * 3 + 1, // Vary line thickness
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw individual particles
      particles.current.forEach((particle) => {
        ctx.strokeStyle = particle.borderColor; // Set border color
        ctx.lineWidth = particle.lineWidth; // Random line thickness

        // Apply particle rotation for squares and triangles
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation * Math.PI / 180);

        // Draw different shapes based on the type
        if (particle.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
          ctx.stroke(); // Draw border only
        } else if (particle.shape === "square") {
          ctx.strokeRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size); // Draw border only
        } else if (particle.shape === "triangle") {
          ctx.beginPath();
          ctx.moveTo(0, -particle.size);
          ctx.lineTo(particle.size, particle.size);
          ctx.lineTo(-particle.size, particle.size);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();

        // Update particle position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.direction = Math.PI - particle.direction; // Change direction on horizontal edge
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.direction = -particle.direction; // Change direction on vertical edge
        }

        // Add rotation to particles with shapes other than circles
        if (particle.shape !== "circle") {
          particle.rotation += particle.speed * 2; // Rotate the shape gradually
        }
      });

      requestAnimationFrame(drawParticles);
    };

    createParticles(6); // Create 6 particles with varied shapes and effects
    drawParticles();

    return () => {
      particles.current.length = 0; // Cleanup particles on unmount
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1, // Keep canvas below other content
      }}
    />
  );
};

export default ParticleCanvas;
