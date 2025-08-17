function ipow(x, n) { return Math.pow(x, n); }
function I_web(hw, tw) { return (tw * ipow(hw, 3)) / 12; }
function I_flange_cent(bf, tf) { return (bf * ipow(tf, 3)) / 12; }
function tube_I(Do, t) { const Di = Do - 2 * t; if (Di < 0) return 0; return Math.PI / 64 * (ipow(Do, 4) - ipow(Di, 4)); }
function tube_area(Do, t) { const Di = Math.max(0, Do - 2 * t); return Math.PI / 4 * (ipow(Do, 2) - ipow(Di, 2)); }

function computeBuiltUp(hw, tw, bf, tf) {
    const Iw = I_web(hw, tw);
    const If = I_flange_cent(bf, tf);
    const d = hw / 2 + tf / 2;
    const Af = bf * tf;
    const Ibu = Iw + 2 * (If + Af * d * d);
    const Abu = tw * hw + 2 * Af;
    return { Ibu, Abu };
}

function solveTube(I_target, t) {
    let lo = 50, hi = 2000;
    for (let i = 0; i < 80; i++) {
        let mid = (lo + hi) / 2;
        let I_mid = tube_I(mid, t);
        if (Math.abs(I_mid - I_target) < 1e3) return mid;
        if (I_mid < I_target) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
}

document.getElementById('calc').addEventListener('click', () => {
    const hw = +document.getElementById('h_w').value;
    const tw = +document.getElementById('t_w').value;
    const bf = +document.getElementById('b_f').value;
    const tf = +document.getElementById('t_f').value;

    const { Ibu, Abu } = computeBuiltUp(hw, tw, bf, tf);

    const t_guess = tf;
    const Do = solveTube(Ibu, t_guess);
    const I_t = tube_I(Do, t_guess);
    const A_t = tube_area(Do, t_guess);

    let out = '';
    out += `Built-Up: I = ${Ibu.toFixed(0)} mm^4 ، A ≈ ${Abu.toFixed(0)} mm²\n`;
    out += `→ الماسورة البديلة عند سماكة t=${t_guess} mm تحتاج قطر خارجي D ≈ ${Do.toFixed(1)} mm\n`;
    out += `ماسورة: I ≈ ${I_t.toFixed(0)} mm^4 ، A ≈ ${A_t.toFixed(0)} mm²\n`;
    out += `\n⚠️ هذه الحسابات تقريبية، يجب مراجعتها بالكود والمعايير التصميمية.`;

    document.getElementById('output').textContent = out;
});
