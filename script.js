
const wishForm = document.getElementById("wishForm");
const wishResult = document.getElementById("wishResult");
const wishPreview = document.getElementById("wishPreview");
const downloadWish = document.getElementById("downloadWish");
const mapPreview = document.getElementById("mapPreview");
const mapDialog = document.getElementById("mapDialog");
const closeMap = document.getElementById("closeMap");
const backToTopButton = document.getElementById("backToTop");
const snoopyImage = new Image();
snoopyImage.src = "assets/pink snoopy.png";
let currentWishImageUrl = null;

function sanitizeFileName(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "guest";
}

mapPreview.addEventListener("click", () => {
    mapDialog.showModal();
});

closeMap.addEventListener("click", () => {
    mapDialog.close();
});

mapDialog.addEventListener("click", (event) => {
    if (event.target === mapDialog) {
        mapDialog.close();
    }
});

window.addEventListener("scroll", () => {
    if (window.scrollY > 350) {
        backToTopButton.classList.add("visible");
    } else {
        backToTopButton.classList.remove("visible");
    }
});

backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

wishForm.addEventListener("input", () => {
    updateWishPreview();
});

wishForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateWishPreview();
});

function updateWishPreview() {
    const guestName = wishForm.elements.guestName.value.trim();
    const guestWish = wishForm.elements.guestWish.value.trim();

    if (!guestName || !guestWish) {
        wishResult.hidden = true;
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 800;

    const context = canvas.getContext("2d");
    if (!context) {
        throw new Error("Could not create the wish card image.");
    }

    drawWishCard(context, guestName, guestWish);

    const safeName = sanitizeFileName(guestName);
    const imageUrl = canvas.toDataURL("image/png");
    if (currentWishImageUrl) {
        URL.revokeObjectURL(currentWishImageUrl);
    }

    canvas.toBlob((blob) => {
        if (!blob) {
            downloadWish.href = imageUrl;
            downloadWish.download = `graduation-wish-for-mnhu-by-${safeName}.png`;
            wishPreview.src = imageUrl;
            wishResult.hidden = false;
            return;
        }

        currentWishImageUrl = URL.createObjectURL(blob);
        downloadWish.href = currentWishImageUrl;
        downloadWish.download = `graduation-wish-for-mnhu-by-${safeName}.png`;
        wishPreview.src = imageUrl;
        wishResult.hidden = false;
    }, "image/png");
}

function drawWishCard(context, guestName, guestWish) {
    const width = 1200;
    const height = 800;

    context.fillStyle = "#fff5f3";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#fffdf9";
    context.fillRect(55, 55, width - 110, height - 110);
    context.strokeStyle = "#f0d5d7";
    context.lineWidth = 3;
    context.strokeRect(55, 55, width - 110, height - 110);

    context.textAlign = "center";
    context.fillStyle = "#c17b94";
    context.font = "700 24px Nunito, sans-serif";
    context.fillText("A LITTLE WISH FOR YOUR GRADUATION", width / 2, 150);

    context.fillStyle = "#b8758d";
    context.font = "500 56px 'Playfair Display', serif";
    context.fillText("Congratulations, Minh Như!", width / 2, 245);

    context.fillStyle = "#d88fa7";
    context.font = "48px Nunito, sans-serif";
    context.fillText("♡", width / 2, 320);

    context.fillStyle = "#73515b";
    context.font = "32px Nunito, sans-serif";
    drawWrappedText(context, guestWish, width / 2, 400, 900, 52);

    context.fillStyle = "#c47c95";
    context.font = "600 30px 'Playfair Display', serif";
    context.fillText(`From ${guestName}`, width / 2, 680);

    if (snoopyImage.complete) {
        context.save();
        context.globalAlpha = 0.92;
        context.drawImage(snoopyImage, width - 210, height - 170, 160, 150);
        context.restore();
    }
}

function drawWrappedText(context, text, centerX, startY, maxWidth, lineHeight) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";

    words.forEach((word) => {
        const candidate = line ? `${line} ${word}` : word;
        if (line && context.measureText(candidate).width > maxWidth) {
            lines.push(line);
            line = word;
        } else {
            line = candidate;
        }
    });

    if (line) lines.push(line);

    const maxLines = 4;
    const visibleLines = lines.slice(0, maxLines);
    if (lines.length > maxLines) {
        visibleLines[maxLines - 1] = `${visibleLines[maxLines - 1]}...`;
    }

    const firstLineY = startY - ((visibleLines.length - 1) * lineHeight) / 2;
    visibleLines.forEach((textLine, index) => {
        context.fillText(textLine, centerX, firstLineY + index * lineHeight);
    });
}
