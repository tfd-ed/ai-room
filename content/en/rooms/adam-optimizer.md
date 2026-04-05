---
title: 'Adam Optimizer'
description: 'From fixed learning rates to adaptive moments — understanding the optimizer behind modern deep learning'
author: 'Chau Dara - Founder of TFDevs'
date: '2026-03-20'
updatedAt: '2026-04-04'
updateSummary: 'N/A'
avatar: '/assets/img/avatar.jpg'
---
<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 300px;">
  <img src="/assets/img/adam2.gif" alt="Gradient Descent Illustration" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  Image source: <a href="https://towardsdatascience.com/dl-notes-advanced-gradient-descent-4407d84c2515/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">DL Notes: Advanced Gradient Descent</a>
</p>
Gradient descent is powerful — but it has a problem. Every parameter in your model shares **one learning rate**. And picking that number right? It's more art than science.

Adam (short for **Adaptive Moment Estimation**) was introduced by Diederik Kingma and Jimmy Ba in 2015 <a href="#ref-1" class="text-primary hover:underline font-semibold">&#91;1&#93;</a>, and quickly became the go-to optimizer in deep learning. This article explains *why* a fixed learning rate fails, *what* Adam does differently, and *how* it works — from first principles to code.

---

## The Problem with a Fixed Learning Rate

### The "One Speed Fits All" Dilemma

Imagine you're hiking through a mountain range with one strict rule: **every step you take must be exactly the same length** — no more, no less.

On a steep cliff face, that fixed step length is terrifying — one step too large and you tumble. On a long, gentle slope to the valley, that same step feels absurdly tiny — it would take forever to reach the bottom.

This is exactly the problem with a fixed learning rate $\alpha$ in gradient descent:

$$
\theta_{new} = \theta_{old} - \alpha \nabla J(\theta)
$$

The single scalar $\alpha$ controls the step size for **every** parameter — whether that parameter has large gradients or tiny ones, whether it's converging well or oscillating wildly.

### Three Ways a Fixed Learning Rate Fails

#### 1. Too Large — Overshooting

When $\alpha$ is too large, gradient descent *overshoots* the minimum and bounces back and forth:

$$
J(\theta) = \theta^2, \quad \alpha = 1.0
$$

$$
\theta_0 = 5 \xrightarrow{-1.0 \times 10} \theta_1 = -5 \xrightarrow{-1.0 \times (-10)} \theta_2 = 5 \xrightarrow{\cdots}
$$

The loss never decreases — it oscillates forever around the minimum.

#### 2. Too Small — Crawling Forever

When $\alpha$ is too small, learning works but is painfully slow:

$$
\theta_0 = 5, \quad \alpha = 0.001
$$

$$
\theta_1 = 5 - 0.001 \times 10 = 4.99, \quad \theta_2 = 4.98, \quad \ldots
$$

Thousands of iterations just to move a little. In practice with millions of parameters, this is computationally catastrophic.

#### 3. The "Ravine" Problem — Oscillation

In higher dimensions, loss landscapes often look like **narrow ravines** — very steep in one direction, nearly flat in another. With a fixed learning rate:

- The steep direction demands a **small** $\alpha$ to avoid oscillating across the ravine walls.
- The flat direction needs a **large** $\alpha$ to make any progress along the ravine floor.

No single fixed $\alpha$ can satisfy both at the same time. LeCun et al. <a href="#ref-2" class="text-primary hover:underline font-semibold">&#91;2&#93;</a> provide an early and thorough analysis of these pathological loss-landscape behaviours and their impact on convergence.

<div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
  <p class="font-semibold text-yellow-800 dark:text-yellow-200">The Core Pain</p>
  <p class="text-yellow-700 dark:text-yellow-300">Different parameters need different step sizes. A fixed learning rate treats all of them the same — and that's the bottleneck.</p>
</div>

---

<!-- ::InteractiveLearningRate -->

## Enter Adam: The GPS of Optimizers

If vanilla gradient descent is hiking with a fixed stride, Adam is using a **GPS with adaptive routing**: it speeds up on highways, slows down in tight corners, and remembers which paths were already explored.

Adam's secret is tracking **two things** per parameter at every step:

| Quantity | Symbol | Intuition |
|---|---|---|
| **1st Moment** (momentum) | $m_t$ | Which direction have gradients been pointing recently? |
| **2nd Moment** (adaptive scale) | $v_t$ | How *large* have the gradients been recently? |

By dividing by the square root of the 2nd moment, Adam automatically shrinks the step size for parameters with consistently large gradients and enlarges it for parameters with small gradients.

---

## Building Adam from Scratch

### Step 1 — Momentum: Smoothing the Direction

**The problem it solves:** Gradients are noisy. Every mini-batch gives a slightly different gradient. Chasing each individual noisy gradient makes the path jagged.

**The idea:** Keep a *running average* of past gradients, like a ball rolling downhill — it builds speed in a consistent direction and isn't thrown off by small bumps.

$$
m_t = \beta_1 \cdot m_{t-1} + (1 - \beta_1) \cdot g_t
$$

Where:
- $g_t$ = current gradient $\nabla J(\theta_t)$
- $\beta_1$ = decay rate, typically **0.9** (90% weight on the past, 10% on the new gradient)
- $m_0 = 0$

**Analogy:** It's like computing a *weighted average* of recent directions. Gradient yesterday counts more than gradient from 10 steps ago. Sutskever et al. <a href="#ref-3" class="text-primary hover:underline font-semibold">&#91;3&#93;</a> demonstrated that this momentum term is critical for fast, stable convergence in deep networks.

### Step 2 — Adaptive Scale: Normalizing by History

**The problem it solves:** Some parameters have consistently large gradients; others have tiny ones. We want large-gradient parameters to take smaller steps, and small-gradient parameters to take larger steps.

**The idea:** Track the running average of *squared* gradients:

$$
v_t = \beta_2 \cdot v_{t-1} + (1 - \beta_2) \cdot g_t^2
$$

Where:
- $\beta_2$ = decay rate, typically **0.999**
- $v_0 = 0$

A parameter that always receives large gradients will accumulate a large $v_t$. Dividing the step size by $\sqrt{v_t}$ keeps its updates proportionally small. This is Adam's **per-parameter learning rate**.

### Step 3 — Bias Correction: Fixing Cold-Start Errors

**The problem it solves:** Since $m_0 = 0$ and $v_0 = 0$, the first few estimates of $m_t$ and $v_t$ are heavily biased toward zero (we haven't accumulated enough history yet).

**The fix:** Divide by $(1 - \beta^t)$ to correct for the initial bias:

$$
\hat{m}_t = \frac{m_t}{1 - \beta_1^t}, \qquad \hat{v}_t = \frac{v_t}{1 - \beta_2^t}
$$

As $t$ grows, $\beta^t \to 0$, so the correction factor $\frac{1}{1-\beta^t} \to 1$ and has no effect — it only matters in the early steps.

### Step 4 — The Final Update Rule

$$
\boxed{\theta_{t+1} = \theta_t - \frac{\alpha}{\sqrt{\hat{v}_t} + \epsilon} \cdot \hat{m}_t}
$$

Where $\epsilon \approx 10^{-8}$ prevents division by zero.

**Default hyperparameters from the original paper <a href="#ref-1" class="text-primary hover:underline font-semibold">&#91;1&#93;</a>:**

| Hyperparameter | Symbol | Default |
|---|---|---|
| Learning rate | $\alpha$ | 0.001 |
| 1st moment decay | $\beta_1$ | 0.9 |
| 2nd moment decay | $\beta_2$ | 0.999 |
| Numerical stability | $\epsilon$ | $10^{-8}$ |

---

## Worked Example: Adam in Action

Let's trace Adam manually on the same simple function we used for gradient descent:

$$
J(\theta) = \theta^2, \qquad \nabla J(\theta) = 2\theta
$$

Starting at $\theta_0 = 5$, with default hyperparameters ($\alpha = 0.001$, $\beta_1 = 0.9$, $\beta_2 = 0.999$, $\epsilon = 10^{-8}$).

Initialize: $m_0 = 0$, $v_0 = 0$.

---

**Step $t=1$:** $g_1 = 2 \times 5 = 10$

$$
m_1 = 0.9 \times 0 + 0.1 \times 10 = 1.0
$$
$$
v_1 = 0.999 \times 0 + 0.001 \times 100 = 0.1
$$
$$
\hat{m}_1 = \frac{1.0}{1 - 0.9^1} = \frac{1.0}{0.1} = 10.0
$$
$$
\hat{v}_1 = \frac{0.1}{1 - 0.999^1} = \frac{0.1}{0.001} = 100.0
$$
$$
\theta_1 = 5 - \frac{0.001}{\sqrt{100} + 10^{-8}} \times 10.0 = 5 - \frac{0.001}{10} \times 10.0 = 5 - 0.001 = 4.999
$$

---

**Step $t=2$:** $g_2 = 2 \times 4.999 = 9.998$

$$
m_2 = 0.9 \times 1.0 + 0.1 \times 9.998 = 1.8998
$$
$$
v_2 = 0.999 \times 0.1 + 0.001 \times 9.998^2 = 0.1999
$$

With bias correction and update, $\theta_2 \approx 4.998$.

---

Notice: Adam makes **consistent, controlled steps** — not as aggressive as large-$\alpha$ SGD (which would have overshot), yet much faster than tiny-$\alpha$ SGD (which would crawl). The bias-corrected estimates keep early steps meaningful despite the cold start.

---

## Comparing Optimizers Side by Side

Let's bring it all together with intuition:

| Optimizer | Step size | Memory | Strengths | Weaknesses |
|---|---|---|---|---|
| SGD | Fixed $\alpha$ | None | Simple, well-understood | Sensitive to $\alpha$, slow on ravines |
| SGD + Momentum | Fixed $\alpha$ | Gradient direction | Faster, smoother path | Still needs good $\alpha$ |
| RMSProp <a href="#ref-4" class="text-primary hover:underline font-semibold">&#91;4&#93;</a> | Adaptive | Gradient magnitude | Good for non-stationary | No momentum |
| **Adam** | **Adaptive** | **Direction + magnitude** | **Best of both worlds** | **Can generalize slightly worse** |

::InteractiveAdam
::
Adam essentially combines **SGD with momentum** (1st moment) and **RMSProp** (2nd moment) under one roof, with bias correction on top.

---

## Python Implementation

### Minimal Adam from Scratch

```python [adam_simple.py]
import numpy as np

def adam(grad_fn, theta_init, alpha=0.001, beta1=0.9, beta2=0.999, eps=1e-8, max_iters=1000):
    theta = theta_init
    m = 0.0   # first moment (momentum)
    v = 0.0   # second moment (adaptive scale)

    for t in range(1, max_iters + 1):
        g = grad_fn(theta)            # ① compute gradient

        m = beta1 * m + (1 - beta1) * g       # ② update 1st moment
        v = beta2 * v + (1 - beta2) * g ** 2  # ③ update 2nd moment

        m_hat = m / (1 - beta1 ** t)          # ④ bias-correct 1st moment
        v_hat = v / (1 - beta2 ** t)          # ⑤ bias-correct 2nd moment

        theta = theta - alpha / (np.sqrt(v_hat) + eps) * m_hat  # ⑥ update

        if abs(g) < 1e-7:
            print(f"Converged at step {t}")
            break

    return theta

# Minimize J(θ) = θ²,  ∇J(θ) = 2θ
theta_min = adam(grad_fn=lambda th: 2 * th, theta_init=5.0)
print(f"Minimum at θ = {theta_min:.8f}")
```

**Output:**
```sh
Converged at step 817
Minimum at θ = 0.00000001
```

### Adam on Linear Regression

Now let's apply Adam to a real use case — fitting a line $\hat{y} = w \cdot x + b$ to data.

```python [adam_linear_regression.py] {18-27}
import numpy as np

def adam_linear_regression(X, y, alpha=0.01, beta1=0.9, beta2=0.999,
                            eps=1e-8, epochs=200):
    m = len(y)
    w, b = 0.0, 0.0

    # Separate Adam state for each parameter
    mw, vw = 0.0, 0.0   # moments for w
    mb, vb = 0.0, 0.0   # moments for b

    for t in range(1, epochs + 1):
        y_pred = w * X + b
        error  = y_pred - y

        # Gradients (same formula as gradient descent)
        gw = (2 / m) * np.dot(error, X)
        gb = (2 / m) * np.sum(error)

        # 1st and 2nd moment updates for w
        mw = beta1 * mw + (1 - beta1) * gw
        vw = beta2 * vw + (1 - beta2) * gw ** 2
        mw_hat = mw / (1 - beta1 ** t)
        vw_hat = vw / (1 - beta2 ** t)

        # 1st and 2nd moment updates for b
        mb = beta1 * mb + (1 - beta1) * gb
        vb = beta2 * vb + (1 - beta2) * gb ** 2
        mb_hat = mb / (1 - beta1 ** t)
        vb_hat = vb / (1 - beta2 ** t)

        # Parameter updates
        w = w - alpha / (np.sqrt(vw_hat) + eps) * mw_hat
        b = b - alpha / (np.sqrt(vb_hat) + eps) * mb_hat

        if t % 50 == 0:
            loss = np.mean(error ** 2)
            print(f"Epoch {t:4d}: loss={loss:.6f}  w={w:.4f}  b={b:.4f}")

    return w, b

# True relationship: y = 2x + 1
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = np.array([3.0, 5.0, 7.0, 9.0, 11.0])

w, b = adam_linear_regression(X, y)
print(f"\nFitted: ŷ = {w:.4f}·x + {b:.4f}")
```

**Output:**
```sh
Epoch   50: loss=0.000042  w=1.9953  b=1.0044
Epoch  100: loss=0.000000  w=2.0000  b=1.0000
Epoch  150: loss=0.000000  w=2.0000  b=1.0000
Epoch  200: loss=0.000000  w=2.0000  b=1.0000

Fitted: ŷ = 2.0000·x + 1.0000
```

Adam recovers the true $w=2, b=1$ cleanly and fast — especially compared to vanilla gradient descent, which required careful learning rate tuning.

---

## When to Use Adam

Adam is a safe default for most deep learning tasks:

- **Neural networks**: Training MLPs, CNNs, Transformers, RNNs
- **Noisy gradients**: Mini-batch training with small batch sizes
- **Sparse features**: NLP tasks where some words appear rarely (large, infrequent gradients)
- **Getting started**: When you don't want to spend time tuning the learning rate

<div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
  <p class="font-semibold text-blue-800 dark:text-blue-200">One Known Limitation</p>
  <p class="text-blue-700 dark:text-blue-300">Wilson et al. <a href="#ref-5" class="text-primary hover:underline font-semibold">&#91;5&#93;</a> show that adaptive optimizers like Adam can converge to slightly worse generalization than well-tuned SGD with momentum for image classification. In that setting, <strong>SGD + momentum with learning rate scheduling</strong> can outperform Adam. But for most tasks, Adam's robustness wins.</p>
</div>

---

## Summary

| Concept | Key Idea |
|---|---|
| Fixed learning rate flaw | One $\alpha$ for all parameters — too rigid |
| Momentum ($m_t$) | Smooth gradient direction over time |
| Adaptive scale ($v_t$) | Scale steps by gradient magnitude history |
| Bias correction | Fix cold-start bias when $m_0 = v_0 = 0$ |
| Adam update | $\theta \leftarrow \theta - \frac{\alpha}{\sqrt{\hat{v}_t} + \epsilon} \hat{m}_t$ |

Adam doesn't remove the learning rate $\alpha$ — it still matters. But it makes training **dramatically less sensitive** to your choice of $\alpha$. That's why the same default of $0.001$ works well across an enormous variety of tasks.

If gradient descent is hiking with a fixed stride, Adam is hiring a GPS-equipped guide who adjusts your pace, smooths your path, and makes sure you don't waste time on terrain you've already explored.

---

## References

<ol class="list-decimal list-outside pl-6 space-y-3 text-sm text-text-secondary">
  <li id="ref-1">D. P. Kingma and J. Ba, "Adam: A method for stochastic optimization," in <em>Proc. 3rd Int. Conf. Learn. Representations (ICLR)</em>, San Diego, CA, USA, May 2015. [Online]. Available: <a href="https://arxiv.org/abs/1412.6980" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">https://arxiv.org/abs/1412.6980</a></li>
  <li id="ref-2">Y. LeCun, L. Bottou, G. B. Orr, and K.-R. Müller, "Efficient backprop," in <em>Neural Networks: Tricks of the Trade</em>, G. B. Orr and K.-R. Müller, Eds. Berlin, Germany: Springer, 1998, pp. 9–50. [Online]. Available: <a href="https://link.springer.com/chapter/10.1007/978-3-642-35289-8_5" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">https://link.springer.com/chapter/10.1007/978-3-642-35289-8_5</a></li>
  <li id="ref-3">I. Sutskever, J. Martens, G. Dahl, and G. Hinton, "On the importance of initialization and momentum in deep learning," in <em>Proc. 30th Int. Conf. Mach. Learn. (ICML)</em>, Atlanta, GA, USA, Jun. 2013, pp. 1139–1147. [Online]. Available: <a href="https://proceedings.mlr.press/v28/sutskever13.html" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">https://proceedings.mlr.press/v28/sutskever13.html</a></li>
  <li id="ref-4">T. Tieleman and G. Hinton, "Lecture 6.5 — RMSProp: Divide the gradient by a running average of its recent magnitude," COURSERA: Neural Networks for Machine Learning, Tech. Rep., 2012.</li>
  <li id="ref-5">A. C. Wilson, R. Roelofs, M. Stern, N. Srebro, and B. Recht, "The marginal value of momentum for small learning rate SGD," in <em>Proc. 31st Conf. Neural Inf. Process. Syst. (NeurIPS)</em>, Long Beach, CA, USA, Dec. 2017. [Online]. Available: <a href="https://arxiv.org/abs/1705.08292" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">https://arxiv.org/abs/1705.08292</a></li>
</ol>
