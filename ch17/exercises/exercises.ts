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
