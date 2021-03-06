export function getColorByHSLRange(rangeArr, currValue, min, max){
    let percent = getPercentByRange(currValue, min, max);
    
    let hRange = rangeArr[0];
    let sRange = rangeArr[1];
    let lRange = rangeArr[2];

    let h = getValueByPercentAndRange(percent, hRange.start, hRange.end);
    let s = getValueByPercentAndRange(percent, sRange.start, sRange.end);
    let l = getValueByPercentAndRange(percent, lRange.start, lRange.end);

    return hslToHEX(h, s, l);
}

export function getStartColorFromParam(rangeArr){
    let h = rangeArr[0].start;
    let s = rangeArr[1].start;
    let l = rangeArr[2].start;

    return hslToHEX(h, s, l);
}

export function getEndColorFromParam(rangeArr){
    let h = rangeArr[0].end;
    let s = rangeArr[1].end;
    let l = rangeArr[2].end;
    
    return hslToHEX(h, s, l);
}

function getPercentByRange(currValue, min, max){
    let base = (max - min);
    let percent = 100;

    if (!base == 0) {
        percent = (currValue - min) / base * 100; 
    }

    return percent;
}

function getValueByPercentAndRange(percent, min, max){
    let base = (max - min);
    let result = (percent * base / 100) + min;
    return result;
}

export function hslToHEX(h, s, l){
    h /= 240;
    s /= 240;
    l /= 240;
    let rgb = hslToRgb(h, s, l);
    let cH = rgb[0] * 0x10000 + rgb[1] * 0x100 + rgb[2] * 0x1;

    return '#' + ('000000' + cH.toString(16)).slice(-6);
}

export function hexToHSL(hex){
    let convRGB = hexToRGB(hex);
    return rgbToHsl(convRGB[0], convRGB[1], convRGB[2]);
}

export function hexToRGB(hex){
    hex = hex.replace('#','');
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);

    return [r, g, b];
}

/* 
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 */
export function hslToRgb(h, s, l){
    let r, g, b;
    
    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function hue2rgb(p, q, t){
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

/*
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 */
export function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    h = Math.round(h*240); s = Math.round(s*240); l = Math.round(l*240); 

    return [h, s, l];
}
