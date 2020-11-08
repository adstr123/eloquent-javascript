function drawTrapezoid(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  indent: number
) {
  const cx = canvas.getContext("2d");
  const padding = 10;
  if (cx) {
    cx.beginPath();
    cx.moveTo(padding, padding + height);
    cx.lineTo(padding + width, padding + height);
    cx.lineTo(padding + width - indent, padding);
    cx.lineTo(padding + indent, padding);
    cx.closePath();
    cx.stroke();
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

function drawDiamond(canvas: HTMLCanvasElement, width: number, height: number) {
  const cx = canvas.getContext("2d");
  const padding = 20;
  if (cx) {
    cx.save();
    cx.translate(padding + width / 2, padding - height);
    cx.rotate((45 * Math.PI) / 180);
    cx.fillStyle = "red";
    cx.fillRect(padding, padding, padding + width, padding + height);
    cx.restore();
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

function drawZigZag(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  lineSeparation: number
) {
  const cx = canvas.getContext("2d");

  if (cx) {
    cx.beginPath();

    for (let i = 1; i < height / lineSeparation; i++) {
      if (i % 2 !== 0) {
        cx.lineTo(width, lineSeparation * i);
      } else {
        cx.lineTo(0, lineSeparation * i);
      }
    }

    cx.stroke();
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

function drawSpiral(canvas: HTMLCanvasElement, radius: number) {
  const cx = canvas.getContext("2d");

  if (cx) {
    cx.beginPath();
    cx.moveTo(radius, radius);

    for (let i = 0; i < 300; i++) {
      let angle = (i * Math.PI) / 30;
      let dist = (radius * i) / 300;
      cx.lineTo(
        radius + Math.cos(angle) * dist,
        radius + Math.sin(angle) * dist
      );
    }

    cx.stroke();
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

function drawStar(canvas: HTMLCanvasElement, radius: number, points: number) {
  const cx = canvas.getContext("2d");

  if (cx) {
    cx.beginPath();
    cx.moveTo(radius * 2, radius);

    for (let i = 1; i <= points; i++) {
      let angle = (i * Math.PI) / points / 2;
      cx.quadraticCurveTo(
        radius,
        radius,
        radius + Math.cos(angle) * radius,
        radius + Math.sin(angle) * radius
      );
    }
    cx.fillStyle = "gold";
    cx.fill();
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

const results = [
  { name: "Satisfied", count: 1043, color: "lightblue" },
  { name: "Neutral", count: 563, color: "lightgreen" },
  { name: "Unsatisfied", count: 510, color: "pink" },
  { name: "No comment", count: 175, color: "silver" },
];

function drawPie(canvas: HTMLCanvasElement) {
  const cx = canvas.getContext("2d");
  if (canvas.width !== canvas.height) {
    throw new Error("Canvas must be a square");
  }
  const radius = canvas.width / 2;

  if (cx) {
    let total = results.reduce((sum, { count }) => sum + count, 0);
    cx.font = `${radius / 5}px Georgia`;
    // Start at the top
    let currentAngle = -0.5 * Math.PI;

    for (let result of results) {
      let sliceAngle = (result.count / total) * 2 * Math.PI;
      cx.beginPath();
      // from current angle, clockwise by slice's angle
      cx.arc(radius, radius, radius, currentAngle, currentAngle + sliceAngle);
      currentAngle += sliceAngle;
      cx.lineTo(radius, radius);
      cx.fillStyle = result.color;
      cx.fill();
    }
    for (let result of results) {
      let sliceAngle = (result.count / total) * 2 * Math.PI;
      console.log(sliceAngle);
      const textX = radius + radius * Math.cos(currentAngle + sliceAngle / 2);
      const textY = radius + radius * Math.sin(currentAngle + sliceAngle / 2);

      cx.fillStyle = "fuchsia";
      cx.fillText(`${result.name}`, textX, textY);
    }
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}

function bounceBall(canvas: HTMLCanvasElement) {
  function updateBall() {
    requestAnimationFrame(updateBall);
  }

  const cx = canvas.getContext("2d");
  if (cx) {
    // setup animation
    const radius = canvas.width / 5;
    cx.beginPath();
    cx.arc(radius, radius, radius, 0, 2 * Math.PI);
    cx.fillStyle = "red";
    cx.fill();

    // start animation
    requestAnimationFrame(updateBall);
  } else {
    throw new ReferenceError(
      `No rendering context exists for HTML element ${canvas}`
    );
  }
}
