---
title: 'Gradient Descent'
description: 'Understanding the optimization algorithm that powers machine learning'
author: 'Chau Dara - Founder of TFDevs'
date: '2026-03-19'
---

<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 300px;">
  <img src="/assets/img/gradient_2.gif" alt="Gradient Descent Illustration" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  Image extracted from: <a href="https://towardsdatascience.com/creating-a-gradient-descent-animation-in-python-3c4dcd20ca51-2/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Creating a Gradient Descent Animation in Python</a>
</p>

Gradient descent is one of the most fundamental optimization algorithms in machine learning. It's a method for finding the minimum of a function by iteratively moving in the direction of steepest descent.

## The Intuition

Imagine you're standing on a mountain in thick fog, and you want to reach the valley below. You can't see far, but you can feel the slope beneath your feet. Gradient descent works the same way: it takes small steps downhill, following the steepest path, until it reaches a minimum.

## The Mathematics

### The Basic Formula

At its core, gradient descent updates parameters using this simple formula:

$$
\theta_{new} = \theta_{old} - \alpha \nabla J(\theta)
$$

Where:
- $\theta$ represents the parameters we're optimizing
- $\alpha$ is the **learning rate** (step size)
- $\nabla J(\theta)$ is the **gradient** of the cost function $J$ with respect to $\theta$

### Understanding the Gradient: From Simple to Complex

Let's demystify the gradient symbol $\nabla$ (called "nabla" or "del") by building up from the simplest case.

#### Case 1: Single Variable (One Parameter)

When we have just **one parameter**, the gradient is simply the **derivative**:

$$
\nabla J(\theta) = \frac{dJ}{d\theta}
$$

The derivative tells us: *"If I increase $\theta$ by a tiny amount, how much does $J$ change?"*

**Example:** For $J(\theta) = \theta^2$:

$$
\nabla J(\theta) = \frac{dJ}{d\theta} = 2\theta
$$

- If $\theta = 5$, then $\nabla J(5) = 10$ → function is increasing, go **left** (decrease $\theta$)
- If $\theta = -3$, then $\nabla J(-3) = -6$ → function is decreasing, go **right** (increase $\theta$)
- If $\theta = 0$, then $\nabla J(0) = 0$ → we're at the minimum!

#### Case 2: Two Variables (Two Parameters)

When we have **two parameters** $\theta_1$ and $\theta_2$, the gradient becomes a vector with two components:

$$
\nabla J(\theta_1, \theta_2) = \begin{bmatrix}
\frac{\partial J}{\partial \theta_1} \\
\frac{\partial J}{\partial \theta_2}
\end{bmatrix}
$$

Each **partial derivative** $\frac{\partial J}{\partial \theta_i}$ asks: *"If I change only $\theta_i$ (keeping others fixed), how much does $J$ change?"*

**Example:** For $J(\theta_1, \theta_2) = \theta_1^2 + \theta_2^2$:

$$
\nabla J = \begin{bmatrix}
2\theta_1 \\
2\theta_2
\end{bmatrix}
$$

At point $(\theta_1=3, \theta_2=4)$:
$$
\nabla J = \begin{bmatrix}
6 \\
8
\end{bmatrix}
$$

This vector points in the direction of steepest **ascent**. We go in the opposite direction (subtract it) to descend!

#### Case 3: Many Variables (General Case)

For **n parameters** $\theta_1, \theta_2, \ldots, \theta_n$, the gradient is an **n-dimensional vector**:

$$
\nabla J(\theta) = \begin{bmatrix}
\frac{\partial J}{\partial \theta_1} \\
\frac{\partial J}{\partial \theta_2} \\
\vdots \\
\frac{\partial J}{\partial \theta_n}
\end{bmatrix}
$$

Each component tells us how sensitive $J$ is to changes in that specific parameter. This is exactly what we need to know which direction to adjust each parameter!

**Key Insight:** Whether you have 1 parameter or 1 million parameters, the idea is the same: compute how much each parameter affects the cost, then adjust them in the opposite direction.

## Walking Through a Complete Example

Let's see gradient descent in action with the simplest case: **one variable**.

Consider minimizing the quadratic function:

$$
J(\theta) = \theta^2
$$

The gradient (derivative) is:

$$
\nabla J(\theta) = \frac{dJ}{d\theta} = 2\theta
$$

The gradient descent update rule becomes:

$$
\theta_{new} = \theta_{old} - \alpha \cdot 2\theta_{old}
$$

Starting at $\theta_0 = 10$ with learning rate $\alpha = 0.1$:

**Iteration 1:**
$$
\theta_1 = 10 - 0.1 \times (2 \times 10) = 10 - 2 = 8
$$
*The gradient was positive (10 slope upward), so we moved left (decreased $\theta$)*

**Iteration 2:**
$$
\theta_2 = 8 - 0.1 \times (2 \times 8) = 8 - 1.6 = 6.4
$$
*Still positive gradient, getting smaller, so smaller steps*

**Iteration 3:**
$$
\theta_3 = 6.4 - 0.1 \times (2 \times 6.4) = 6.4 - 1.28 = 5.12
$$
*Pattern continues: as we approach the minimum, the gradient shrinks, so our steps get smaller automatically!*

With each step, we get closer to the minimum at $\theta = 0$. Notice how the steps naturally get smaller as the gradient decreases near the minimum.

## Key Concepts

### Learning Rate

The learning rate $\alpha$ is crucial:

- **Too large**: We might overshoot the minimum or even diverge
- **Too small**: Convergence will be very slow
- **Just right**: Efficient convergence to the minimum

### Let's do experiments with different learning rates and see how it affects convergence! 

::InteractiveLearningRate
::

### Types of Gradient Descent

#### 1. Batch Gradient Descent

Uses the **entire dataset** to compute the gradient:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta)
$$

Where $J(\theta)$ is computed over all training examples.

#### 2. Stochastic Gradient Descent (SGD)

Updates parameters using **one training example** at a time:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta; x^{(i)}, y^{(i)})
$$

#### 3. Mini-batch Gradient Descent

A compromise: uses a **small batch** of examples:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta; x^{(i:i+b)}, y^{(i:i+b)})
$$

Where $b$ is the batch size.

## Convergence

Gradient descent converges when the gradient becomes very small:

$$
|\nabla J(\theta)| < \epsilon
$$

Where $\epsilon$ is a small threshold value.

## Challenges

1. **Local Minima**: The algorithm might get stuck in local minima instead of finding the global minimum
2. **Saddle Points**: Points where the gradient is zero but aren't minima
3. **Plateau Regions**: Areas where the gradient is very small, slowing down learning

## Real-World Applications

Gradient descent is used to train:
- **Neural Networks**: Optimizing millions of parameters
- **Linear Regression**: Finding the best-fit line
- **Logistic Regression**: Classification problems
- **Support Vector Machines**: Finding optimal hyperplanes

### Gradient Descent in Deep Learning

<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 340px;">
  <img src="/assets/img/deep-rl-khmer.png" alt="Deep Learning Neural Network and Cost Function" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  A deep neural network uses gradient descent to train weights across all its layers by minimizing the cost function.
</p>

The image above shows a **Deep Neural Network** — a powerful type of model that directly relies on gradient descent to optimize its cost function.

In deep learning:
- **Input Layer** receives raw data (e.g. image pixels, words, numbers)
- **Hidden Layers** perform feature extraction — learning complex patterns from data
- **Output Layer** produces the final prediction
- **Weights** $w$ in each connection are the **parameters $\theta$** that gradient descent optimizes

During **training**, the process is:
$$
\begin{aligned}
&\text{Forward Pass} \\
&\rightarrow \text{Compute Loss } J(\theta) \\
&\rightarrow \text{Backpropagation} \\
&\rightarrow \text{Gradient Descent Update}
\end{aligned}
$$

A network may have millions of neurons → millions of weights → a gradient vector with **millions of dimensions** — yet gradient descent works exactly the same way as in the 1D case: move opposite to the gradient to reduce the loss!

## Next Steps

Once you understand gradient descent, you can explore advanced variations:
- **Momentum**: Adds velocity to updates
- **Adam**: Adaptive learning rates per parameter
- **RMSprop**: Handles sparse gradients better

---

