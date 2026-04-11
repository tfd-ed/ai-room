---
title: 'Derivatives — The Language of Change'
description: 'From slopes of lines to the calculus engine behind machine learning'
author: 'Chau Dara - Founder of TFDevs'
date: '2026-04-10'
updatedAt: '2026-04-10'
updateSummary: 'N/A'
avatar: '/assets/img/avatar.jpg'
---

Every time a neural network learns, it asks one question over and over: *"If I nudge this parameter slightly, does the error go up or down — and by how much?"* That question is answered by the **derivative**. Before we talk about gradients or optimizers, we need to understand derivatives from scratch.

---
<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 300px;">
  <img src="/assets/img/derivative.gif" alt="Derivative Illustration" class="w-full h-full" style="object-fit: contain;" />
</div>
---

## Part 1 — Lines and Slopes

### The Equation of a Line

The simplest relationship between two quantities is a straight line:

$$
y = mx + b
$$

Where:
- $x$ is the **input**
- $y$ is the **output**
- $m$ is the **slope** — how steeply the line rises or falls
- $b$ is the **y-intercept** — where the line crosses the vertical axis

**Example:** $y = 2x + 1$

| $x$ | $y = 2x + 1$ |
|---|---|
| 0 | 1 |
| 1 | 3 |
| 2 | 5 |
| 3 | 7 |

Every time $x$ increases by 1, $y$ increases by **exactly 2**. The slope $m = 2$ captures this constant rate.

### Computing the Slope Between Two Points

Given any two points $(x_1, y_1)$ and $(x_2, y_2)$ on a line, the slope is:

$$
m = \frac{\Delta y}{\Delta x} = \frac{y_2 - y_1}{x_2 - x_1}
$$

This is the **rise over run** formula — how much $y$ changes (rise) per unit change in $x$ (run).

<div class="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
  <p class="font-semibold text-blue-800 dark:text-blue-200">Why Does Slope Matter?</p>
  <p class="text-blue-700 dark:text-blue-300">Slope tells you the <strong>rate of change</strong>. A slope of 2 means "for every 1 unit step in x, y changes by 2." A slope of −3 means y decreases by 3 for every step forward. A slope of 0 means y doesn't change at all — it's flat.</p>
</div>

---

## Part 2 — When Lines Become Curves

A line has a **constant** slope — it's the same everywhere. But most interesting functions in mathematics (and in machine learning) are **curves** whose steepness changes at every point.

Consider the parabola:

$$
f(x) = x^2
$$

| $x$ | $f(x) = x^2$ |
|---|---|
| −3 | 9 |
| −1 | 1 |
| 0 | 0 |
| 1 | 1 |
| 3 | 9 |

Near $x = 0$ the curve is nearly flat. Near $x = 3$ it rises steeply. The slope is **different at every point** — which means the single formula $m = \frac{\Delta y}{\Delta x}$ between two distant points only gives us an *average*.

### Average Rate of Change

For two points $x$ and $x + h$ on a curve $f$, the **average rate of change** over that interval is:

$$
\frac{\Delta f}{\Delta x} = \frac{f(x + h) - f(x)}{h}
$$

This is the slope of the **secant line** — the straight line connecting the two points on the curve.

**Example** on $f(x) = x^2$ between $x = 1$ and $x = 3$:

$$
\frac{f(3) - f(1)}{3 - 1} = \frac{9 - 1}{2} = 4
$$

That is the average steepness between $x=1$ and $x=3$, but it doesn't tell us what the slope is *at* a specific point.

---

## Part 3 — The Limit: Zooming In to a Single Point

To find the slope **at one exact point**, we shrink the interval $h$ down toward zero. As $h$ gets smaller and smaller, the secant line rotates until it becomes the **tangent line** — touching the curve at exactly one point and matching its steepness there.

Formally, the **instantaneous rate of change** at $x$ is the **limit**:

$$
\lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

This is the core idea of a derivative.

### Limits Intuitively

A limit asks: *"What value does an expression approach as a variable gets closer and closer to some number — even if it never arrives?"*

$$
\lim_{h \to 0} \frac{(x+h)^2 - x^2}{h}
$$

Expand the numerator:

$$
= \lim_{h \to 0} \frac{x^2 + 2xh + h^2 - x^2}{h} = \lim_{h \to 0} \frac{2xh + h^2}{h} = \lim_{h \to 0} (2x + h)
$$

As $h \to 0$:

$$
= 2x
$$

The slope of $f(x) = x^2$ at any point $x$ is exactly $2x$.

---

## Part 4 — The Derivative

### Definition

The **derivative** of a function $f$ at point $x$, written $f'(x)$ or $\frac{df}{dx}$, is:

$$
\boxed{f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}}
$$

It gives the **instantaneous rate of change** — the slope of the tangent line at every point.

### Geometric Meaning

| Derivative Value | Meaning |
|---|---|
| $f'(x) > 0$ | Function is **increasing** at $x$ |
| $f'(x) < 0$ | Function is **decreasing** at $x$ |
| $f'(x) = 0$ | Function has a **flat point** (possible minimum, maximum, or saddle) |
| Large $\|f'(x)\|$ | Function is **changing rapidly** |
| Small $\|f'(x)\|$ | Function is **changing slowly** |

---

## Part 5 — Differentiation Rules

Computing limits by hand every time would be exhausting. Mathematicians have derived shortcut **rules** that cover almost every function you'll encounter.

### Power Rule

For $f(x) = x^n$:

$$
\frac{d}{dx} x^n = n \cdot x^{n-1}
$$

**Examples:**

| Function | Derivative |
|---|---|
| $x^2$ | $2x$ |
| $x^3$ | $3x^2$ |
| $x^{10}$ | $10x^9$ |
| $x$ (i.e. $x^1$) | $1$ |
| $5$ (constant, $x^0$) | $0$ |

### Constant Multiple Rule

$$
\frac{d}{dx}[c \cdot f(x)] = c \cdot f'(x)
$$

If $f(x) = 3x^2$, then $f'(x) = 3 \cdot 2x = 6x$.

### Sum Rule

$$
\frac{d}{dx}[f(x) + g(x)] = f'(x) + g'(x)
$$

If $f(x) = x^3 + 5x^2 - 2x + 7$, differentiate term by term:

$$
f'(x) = 3x^2 + 10x - 2
$$

### Chain Rule

For a **composition** of functions $f(g(x))$:

$$
\frac{d}{dx} f(g(x)) = f'(g(x)) \cdot g'(x)
$$

Read as: *"derivative of outer, evaluated at inner — times derivative of inner."*

**Example:** $h(x) = (3x + 1)^4$

Let $g(x) = 3x + 1$ and $f(u) = u^4$:

$$
h'(x) = 4(3x+1)^3 \cdot 3 = 12(3x+1)^3
$$

The chain rule is everywhere in machine learning — **backpropagation** is essentially repeated application of it through layers of a neural network.

### Common Derivatives Reference

| Function | Derivative |
|---|---|
| $e^x$ | $e^x$ |
| $\ln(x)$ | $\frac{1}{x}$ |
| $\sin(x)$ | $\cos(x)$ |
| $\cos(x)$ | $-\sin(x)$ |
| $\sigma(x) = \frac{1}{1+e^{-x}}$ (sigmoid) | $\sigma(x)(1 - \sigma(x))$ |

---
::InteractiveDerivative
::
---
## Part 6 — Derivatives in Practice

### Finding Minima and Maxima

If $f'(x) = 0$ the function is momentarily flat — this is a **critical point**. There are three types:

- **Local minimum**: function dips down then rises → $f'(x)$ changes from negative to positive
- **Local maximum**: function rises then dips → $f'(x)$ changes from positive to negative
- **Saddle point**: function is flat but continues in the same general direction

**Example:** Find the minimum of $f(x) = x^2 - 4x + 5$

$$
f'(x) = 2x - 4 = 0 \implies x = 2
$$

At $x = 2$: $f(2) = 4 - 8 + 5 = 1$ — this is the minimum.

```python
def f(x):
    return x**2 - 4*x + 5

def f_prime(x):
    return 2*x - 4

# Find where derivative = 0
# 2x - 4 = 0  =>  x = 2
x_min = 2
print(f"Minimum at x={x_min}, f(x)={f(x_min)}")  # x=2, f(x)=1
```

### The Derivative as a Direction Signal

This is the key insight that bridges calculus to machine learning:

> **If $f'(x) > 0$ at some point, moving $x$ to the right increases $f$. Moving $x$ to the left decreases $f$.**
>
> **If $f'(x) < 0$, the opposite is true.**

To **minimize** $f$, we should always move $x$ in the direction **opposite** to the derivative:

$$
x_{\text{new}} = x_{\text{old}} - \alpha \cdot f'(x_{\text{old}})
$$

Where $\alpha$ is a small step size. Notice anything? This is exactly the **gradient descent update rule**.

---

## Part 7 — From One Variable to Many: The Gradient

Machine learning models have not one parameter, but **millions**. A loss function $J$ might depend on weights $w_1, w_2, \ldots, w_n$. We need derivatives with respect to *each* parameter simultaneously.

### Partial Derivatives

A **partial derivative** holds all other variables constant and differentiates with respect to one:

$$
\frac{\partial J}{\partial w_i} \quad \text{= "how much does J change if we nudge only } w_i \text{?"}
$$

**Example:** $J(w_1, w_2) = w_1^2 + 3w_1 w_2 + w_2^2$

$$
\frac{\partial J}{\partial w_1} = 2w_1 + 3w_2 \qquad \frac{\partial J}{\partial w_2} = 3w_1 + 2w_2
$$

### The Gradient Vector

Stack all partial derivatives into a single vector — this is the **gradient** $\nabla J$:

$$
\nabla J(w_1, w_2, \ldots, w_n) = \begin{bmatrix}
\frac{\partial J}{\partial w_1} \\[4pt]
\frac{\partial J}{\partial w_2} \\
\vdots \\[4pt]
\frac{\partial J}{\partial w_n}
\end{bmatrix}
$$

The gradient is the multi-dimensional equivalent of the derivative. It points in the direction of **steepest ascent** in the loss landscape. To minimize the loss, we move in the **opposite direction** — exactly what gradient descent does.

<div class="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-r-lg my-6">
  <p class="font-semibold text-green-800 dark:text-green-200">The Bridge to Machine Learning</p>
  <p class="text-green-700 dark:text-green-300">
    In ML, the loss function $J(\theta)$ measures how wrong the model is. The gradient $\nabla J(\theta)$ tells us which direction in parameter space increases the error most. By stepping in the <em>opposite</em> direction, we reduce the error — step by step, iteration by iteration.
  </p>
</div>

---

## Part 8 — A Complete Example: Linear Regression

Let's see all of this in action.

**Setup:** We have data points $(x^{(i)}, y^{(i)})$ and want to fit $\hat{y} = wx + b$.

**Loss function** (Mean Squared Error):

$$
J(w, b) = \frac{1}{m} \sum_{i=1}^{m} \left(\hat{y}^{(i)} - y^{(i)}\right)^2 = \frac{1}{m} \sum_{i=1}^{m} \left(wx^{(i)} + b - y^{(i)}\right)^2
$$

**Partial derivative w.r.t. $w$** (using chain rule — derivative of outer squared term times derivative of inner $wx+b$):

$$
\frac{\partial J}{\partial w} = \frac{2}{m} \sum_{i=1}^{m} \left(wx^{(i)} + b - y^{(i)}\right) \cdot x^{(i)}
$$

**Partial derivative w.r.t. $b$**:

$$
\frac{\partial J}{\partial b} = \frac{2}{m} \sum_{i=1}^{m} \left(wx^{(i)} + b - y^{(i)}\right)
$$

**Gradient descent updates** — move opposite to the gradient:

$$
w \leftarrow w - \alpha \cdot \frac{\partial J}{\partial w}, \qquad b \leftarrow b - \alpha \cdot \frac{\partial J}{\partial b}
$$

```python
import numpy as np

# Data: true relationship y = 3x + 2
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = np.array([5.0, 8.0, 11.0, 14.0, 17.0])

w, b = 0.0, 0.0   # start at zero
alpha = 0.01
m = len(y)

for epoch in range(500):
    y_pred = w * X + b              # forward pass
    error  = y_pred - y             # residuals: ŷ - y

    # Partial derivatives (the gradient)
    dw = (2 / m) * np.dot(error, X) # ∂J/∂w
    db = (2 / m) * np.sum(error)    # ∂J/∂b

    # Gradient descent step
    w = w - alpha * dw
    b = b - alpha * db

print(f"Fitted: ŷ = {w:.4f}·x + {b:.4f}")
# Output: ŷ = 3.0000·x + 2.0000
```

The derivative — computed analytically with calculus, then applied iteratively — is what drives the entire learning process.

---

## Summary

| Concept | One-Line Definition |
|---|---|
| **Slope of a line** | $m = \frac{\Delta y}{\Delta x}$ — constant rate of change |
| **Average rate of change** | $\frac{f(x+h)-f(x)}{h}$ — slope of secant over interval $h$ |
| **Limit** | The value an expression approaches as $h \to 0$ |
| **Derivative** | $f'(x) = \lim_{h\to 0}\frac{f(x+h)-f(x)}{h}$ — instantaneous rate of change |
| **Power rule** | $\frac{d}{dx} x^n = nx^{n-1}$ |
| **Chain rule** | $\frac{d}{dx}f(g(x)) = f'(g(x))\cdot g'(x)$ — essential for backprop |
| **Partial derivative** | Derivative holding all other variables fixed |
| **Gradient** | Vector of all partial derivatives — points toward steepest ascent |

The derivative is the mathematical answer to the question *"which way is uphill?"* In machine learning we use its negative — *downhill* — to train every model.

---

## What's Next?

You now have the calculus foundation. The **gradient descent** algorithm takes this one concept — move opposite to the derivative — and turns it into a complete optimization engine for machine learning.

<div class="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg p-6 my-6 flex items-start gap-4">
  <div class="flex-1">
    <p class="font-bold text-indigo-900 dark:text-indigo-100 text-lg mb-1">Next Room: Gradient Descent</p>
    <p class="text-indigo-700 dark:text-indigo-300 mb-4">See how the derivative becomes an optimization algorithm — with interactive experiments, full Python code, and a walk through every step of the math.</p>
    <a href="/rooms/gradient-descent" class="inline-block  font-semibold px-5 py-2 rounded-lg">
      Enter the Gradient Descent Room →
    </a>
  </div>
</div>
