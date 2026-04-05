---
title: 'ស្វែងយល់ពី Gradient Descent Algorithm'
description: 'ស្វែងយល់ពីរ Algorithm ដែលជាមូលដ្ឋានគ្រឹះនៃ Machine Learning។ យល់ដឹងពីរបៀបដែលវាស្វែងរកតម្លៃអប្បបរមានៃអនុគមន៍ម្តងមួយជំហានៗ។'
author: 'ចៅ ដារ៉ា - Founder of TFDevs'
date: '2026-03-19'
updatedAt: '2026-03-20'
updateSummary: 'បានបន្ថែមការអនុវត្ត Python និងការពន្យល់លម្អិតអំពី gradient descent។'
avatar: '/assets/img/avatar.jpg'
---
<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 300px;">
  <img src="/assets/img/gradient_2.gif" alt="Gradient Descent Illustration" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  រូបភាពយកមកពី: <a href="https://towardsdatascience.com/creating-a-gradient-descent-animation-in-python-3c4dcd20ca51-2/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Creating a Gradient Descent Animation in Python</a>
</p>

Gradient Descent គឺជា optimization algorithm មូលដ្ឋានមួយ ក្នុងចំណោម algorithms ដែលមាននៅក្នុង machine learning។ វាជាវិធីសាស្រ្តសម្រាប់ស្វែងរកតម្លៃអប្បបរមានៃអនុគមន៏ ដោយដើរម្តងមួយជំហាន (iteration) ជាបន្តបន្ទាប់ក្នុងទិសដៅ ដែលធ្វើឲ្យអនុគមន៏កាន់តែតូចទៅៗ។

## ប្រៀបធៀបលេងៗ

ស្រមៃថា អ្នកកំពុងឈរនៅលើភ្នំមួយដែលមានអ័ព្ទក្រាស់ ហើយអ្នកចង់ទៅជ្រលងខាងក្រោម។ អ្នកមិនអាចមើលឃើញឆ្ងាយទេដោយសារមានអ័ព្ទក្រាស់ពេក ប៉ុន្តែអ្នកនៅបាតជើងរបស់អ្នក អាចដឹងថាកំពុងចុះជ្រៅទៅៗ រឺ ឡើងខ្ពង់ទៅៗ តាមរយៈជម្រោលចោត ។ Gradient descent ធ្វើរការដូចគ្នានេះដែរ: វាធ្វើម្តងមួយជំហានតូចៗចុះក្រោម តាមផ្លូវចម្រោងបំផុត រហូតដល់វាទៅដល់ចំណុចអប្បបរមា ទាបបំផុត។

## គណិតវិទ្យា

### រូបមន្តមូលដ្ឋាន

Gradient descent ធ្វើបច្ចុប្បន្នភាព parameters ដោយប្រើរូបមន្តសាមញ្ញនេះ:

$$
\theta_{new} = \theta_{old} - \alpha \nabla J(\theta)
$$

ដែល:
- $\theta$ តំណាងឱ្យ parameters ដែលយើងកំពុង optimize (តើតម្លៃ Parameter ណាមួយដែលយើងកំពុងស្វែងរក ដែលធ្វើឲ្យអនុគមន៍ $J$ មានតម្លៃតិចបំផុត)
- $\alpha$ គឺ **learning rate** (អត្រាបោះជំហាន ឬ ទំហំជំហាន)
- $J(\theta)$ គឺ **cost function** ឬ **objective function** ដែលយើងចង់ រកតម្លៃ $\theta$ ណាដែលធ្វើឲ្យ $J$ មានតម្លៃតូចបំផុត
- $\nabla J(\theta)$ គឺ **Gradient(ដេរីវេ | Derivative)** នៃ $J$ ជាអនុគមន៍នៃ $\theta$

### ការយល់ដឹងពី Gradient: ពីសាមញ្ញទៅ កំរិតខ្ពស់

តោះបកស្រាយនិមិត្តសញ្ញា gradient $\nabla$ (ហៅថា "nabla" ឬ "del") ដោយបង្កើតពីករណីសាមញ្ញបំផុត។

#### ករណី 1: អថេរតែមួយ (Parameter មួយ)

នៅពេលយើងមាន **parameter តែមួយ**, gradient គឺគ្រាន់តែជា **ដេរីវេ**:

$$
\nabla J(\theta) = \frac{dJ}{d\theta}
$$

Derivative ប្រាប់យើងថា: *"ប្រសិនបើខ្ញុំបង្កើន $\theta$ បន្តិចបន្តួច តើ $J$ ផ្លាស់ប្តូរប៉ុន្មាន?"*

**ឧទាហរណ៍:** សម្រាប់ $J(\theta) = \theta^2$:

$$
\nabla J(\theta) = \frac{dJ}{d\theta} = 2\theta
$$

- ប្រសិនបើ $\theta = 5$, នោះ $\nabla J(5) = 10$ → អនុគមន៍កំពុងកើនឡើង, ទៅ**ខាងឆ្វេង** (បន្ថយ $\theta$)
- ប្រសិនបើ $\theta = -3$, នោះ $\nabla J(-3) = -6$ → អនុគមន៍កំពុងថយចុះ, ទៅ**ខាងស្តាំ** (បង្កើន $\theta$)
- ប្រសិនបើ $\theta = 0$, នោះ $\nabla J(0) = 0$ → យើងស្ថិតនៅចំណុចអប្បបរមា!

#### ករណី 2: អថេរពីរ (Parameters ពីរ)

នៅពេលយើងមាន **parameters ពីរ** $\theta_1$ និង $\theta_2$, gradient ក្លាយជា vector មួយមានធាតុផ្សំពីរ:

$$
\nabla J(\theta_1, \theta_2) = \begin{bmatrix}
\frac{\partial J}{\partial \theta_1} \\
\frac{\partial J}{\partial \theta_2}
\end{bmatrix}
$$

**Partial derivative** នីមួយៗ $\frac{\partial J}{\partial \theta_i}$ សួរថា: *"ប្រសិនបើខ្ញុំផ្លាស់ប្តូរតែ $\theta_i$ (រក្សា អថេរផ្សេងទៀតថេរ), តើ $J$ ផ្លាស់ប្តូរប៉ុន្មាន?"*

**ឧទាហរណ៍:** សម្រាប់ $J(\theta_1, \theta_2) = \theta_1^2 + \theta_2^2$:

$$
\nabla J = \begin{bmatrix}
2\theta_1 \\
2\theta_2
\end{bmatrix}
$$

នៅចំណុច $(\theta_1=3, \theta_2=4)$:
$$
\nabla J = \begin{bmatrix}
6 \\
8
\end{bmatrix}
$$

Vector នេះចង្អុលទៅទិសនៃការឡើង**ចម្រោងបំផុត**។ យើងទៅក្នុងទិសផ្ទុយ (ដក វា) ដើម្បីចុះក្រោម!

#### ករណី 3: អថេរច្រើន (ករណីទូទៅ)

សម្រាប់ **n parameters** $\theta_1, \theta_2, \ldots, \theta_n$, gradient គឺ **n-dimensional vector**:

$$
\nabla J(\theta) = \begin{bmatrix}
\frac{\partial J}{\partial \theta_1} \\
\frac{\partial J}{\partial \theta_2} \\
\vdots \\
\frac{\partial J}{\partial \theta_n}
\end{bmatrix}
$$

ធាតុផ្សំនីមួយៗប្រាប់យើងថា តើ $J$ ប្រែប្រួលប៉ុន្មាន ចំពោះការផ្លាស់ប្តូរនៃ parameter ក្នុងចំណោមណាមួយនោះ។ នេះគឺជាអ្វីដែលយើងត្រូវដឹង ដើម្បីកំណត់ថា តើយើងគួរកែ parameter នីមួយៗទៅទិសណា!

**ចំណុចសំខាន់:** មិនថាអ្នកមាន parameter 1 ឬ 1 លាន, គំនិតគឺដូចគ្នាតេ: គណនាថា តើ parameter នីមួយៗប៉ះពាល់ដល់ cost ប៉ុន្មាន, បន្ទាប់មកកែសម្រួលវាក្នុងទិសផ្ទុយ។

## ឧទាហរណ៍ពេញលេញ

តោះមើល gradient descent ក្នុងការដំណើរការជាមួយករណីសាមញ្ញបំផុត: **អថេរតែមួយ**។

សូមគិតរកការបន្ថយទៅប្រកដដែលអប្បបរមាសម្រាប់អនុគមន៍ quadratic:

$$
J(\theta) = \theta^2
$$

Gradient (ដេរីវេ) គឺ:

$$
\nabla J(\theta) = \frac{dJ}{d\theta} = 2\theta
$$

យើងអាចសរសេរ Gradient descent algorithm ជា:

$$
\theta_{new} = \theta_{old} - \alpha \cdot 2\theta_{old}
$$

ចាប់ផ្ដើមនៅ $\theta_0 = 10$ ជាមួយ learning rate $\alpha = 0.1$:

**Iteration 1 (ជំហានទី 1):**
$$
\theta_1 = 10 - 0.1 \times (2 \times 10) = 10 - 2 = 8
$$
*Gradient វិជ្ជមាន (10 ជំរាលឡើងខាងលើ), ដូច្នេះយើងបានធ្វើចលនាទៅខាងឆ្វេង (បន្ថយ $\theta$)*

**Iteration 2 (ជំហានទី 2):**
$$
\theta_2 = 8 - 0.1 \times (2 \times 8) = 8 - 1.6 = 6.4
$$
*នៅតែជា gradient វិជ្ជមាន, កំពុងតូចទៅ, ដូច្នេះជំហានតូចជាង*

**Iteration 3 (ជំហានទី 3):**
$$
\theta_3 = 6.4 - 0.1 \times (2 \times 6.4) = 6.4 - 1.28 = 5.12
$$
*Pattern បន្ត: នៅពេលយើងចូលទៅកាន់ចំណុចអប្បបរមា, gradient កាន់តែតូចទៅៗ, ដូច្នេះជំហានរបស់យើងតូចជាងដោយស្វ័យប្រវត្តិ!*

ជាមួយនឹងជំហាននីមួយៗ, យើងចូលទៅកាន់ជិតនូវចំណុចអប្បបរមានៅ $\theta = 0$។ សូមកត់សម្គាល់ថា ជំហានតូចជាងដោយធម្មជាតិ នៅពេល gradient ថយចុះក្បែរនូវចំណុចអប្បបរមា!

## គំនិតសំខាន់ៗ

### Learning Rate | អត្រាបោះជំហាន ឬ ទំហំជំហាន

Learning rate $\alpha$ មានសំខាន់សំខាន់:

- **ទំហំពេក**: យើងអាចរំលងចំណុចអប្បបរមា ឬ បង្កើតការវិលជុំមិនចប់ (មិនដល់គោលដៅ)
- **ទំហំតូច**: ចំណាយពេលច្រើនហើយ កម្រដល់គោលដៅ
- **សមស្រប**: ទៅដល់គោលដៅបានយ៉ាងមានប្រសិទ្ធភាព
  
### តោះធ្វើតេស្តជាមួយ learning rates ផ្សេងៗ ហើយមើលថាវាអាចប៉ះពាល់ដល់ការចូលរួមគ្នា (convergence) យ៉ាងដូចម្តេច!

::InteractiveLearningRate
::

### ប្រភេទនៃ Gradient Descent

#### 1. Batch Gradient Descent

ប្រើ**ទិន្នន័យទាំងអស់** ដើម្បីគណនា gradient:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta)
$$

ដែល $J(\theta)$ ត្រូវបានគណនាលើឧទាហរណ៍បន្តុបកយសិក្សាទាំងអស់។

#### 2. Stochastic Gradient Descent (SGD)

Update parameters ដោយប្រើ**ឧទាហរណ៍បន្តុបកយសិក្សាមួយម្តងមួយ** ក្នុងមួយពេល:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta; x^{(i)}, y^{(i)})
$$

#### 3. Mini-batch Gradient Descent

ជាការប្រទាក់ចូលគ្នា: ប្រើ**batch តូចមួយ** នៃឧទាហរណ៍:

$$
\theta = \theta - \alpha \nabla_\theta J(\theta; x^{(i:i+b)}, y^{(i:i+b)})
$$

ដែល $b$ គឺ batch size។

## ចំណុចរួមតូច (Convergence)

Gradient descent ចូលរួមគ្នា នៅពេល gradient ក្លាយជាតូចបំផុត:

$$
|\nabla J(\theta)| < \epsilon
$$

ដែល $\epsilon$ គឺតម្លៃ threshold តូចមួយ។

## បញ្ហាប្រឈម

1. **Local Minima**: Algorithm អាចជាប់គាំងនៅ local minima ជំនួសឱ្យការស្វែងរក global minimum
2. **Saddle Points**: ចំណុចដែល gradient រកឃើញថាសូន្យ ប៉ុន្តែមិនមែនជាចំណុចអប្បបរមា
3. **Plateau Regions**: តំបន់ដែល gradient មានទំហំតូចបំផុត ធ្វើឱ្យការសិក្សាយឺត

## ការអនុវត្តន៍ក្នុងពិភពលោកជាក់ស្តែង

Gradient descent ត្រូវបានប្រើដើម្បីបណ្តុះបណ្តាល:
- **Neural Networks**: ការ Optimize parameters រាប់លាន
- **Linear Regression**: ការស្វែងរក best-fit line
- **Logistic Regression**: បញ្ហា classification
- **Support Vector Machines**: ការស្វែងរក optimal hyperplanes

### Gradient Descent ក្នុង Deep Learning

<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 340px;">
  <img src="/assets/img/deep-rl-khmer.png" alt="Deep Learning Neural Network and Cost Function" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  Deep Neural Network ប្រើ Gradient Descent ដើម្បីបណ្តុះបណ្តាលទម្ងន់ (weights) ក្នុង layers ផ្សេងៗ
</p>

រូបភាពខាងលើបង្ហាញពី **Deep Neural Network** — ប្រភេទ Neural Network ពេញនិយមមួយ ដែលប្រើ Gradient Descent ដើម្បី optimize cost function។

ក្នុង Deep Learning:
- **Input Layer** ទទួល data (ឧ. pixels នៃរូបភាព, ពាក្យ,  លេខ)
- **Hidden Layers** ជ្រើរើសធ្វើ feature extraction — ស្វែងរកគំរូ (patterns) ស្មុគស្មាញ ពីទិន្នន័យ
- **Output Layer** ផ្តល់ការទស្សន៍ទាយ (prediction) ចុងក្រោយ
- **Weights** $w$ (ទម្ងន់) ក្នុង connections នីមួយៗ គឺជា **parameters $\theta$** ដែល Gradient Descent ត្រូវ optimize

ក្នុងអំឡុងពេល **Training**:
$$
\begin{aligned}
&\text{Forward Pass} \\
&\rightarrow \text{Compute Loss } J(\theta) \\
&\rightarrow \text{Backpropagation} \\
&\rightarrow \text{Gradient Descent Update}
\end{aligned}
$$

Network មួយ មាន neurons រាប់លាន → weights រាប់លាន → gradient vector មាន **រាប់លាន dimensions** — ប៉ុន្តែ Gradient Descent ដំណើរការដូចគ្នានឹង 1D ដែរ: update ក្នុងទិស opposite នៃ gradient!

## អនុវត្តក្នុង Python

ខាងក្រោមជាការសរសេរកូដ Python ដោយមិនប្រើ ML libraries ណាមួយ។ Code block នីមួយៗ ត្រូវតទៅនឹងរូបមន្ត math ខាងលើ — **ជួរ highlighted** ជា formula ចម្បង។

### ជំហានទី 1 — Cost Function និង Gradient

$$J(\theta) = \theta^2, \qquad \nabla J(\theta) = 2\theta$$

```python [gradient_descent.py]
# J(θ) = θ²  →  អនុគមន៍ដែលយើងចង់ minimize
def cost(theta):
    return theta ** 2

# ∇J(θ) = dJ/dθ = 2θ  →  derivative (gradient) របស់វា
def gradient(theta):
    return 2 * theta
```

### ជំហានទី 2 — Update Rule

$$\theta_{new} = \theta_{old} - \alpha \cdot \nabla J(\theta)$$

```python title="gradient_descent.py" {3}
def update(theta, alpha):
    grad = gradient(theta)           # ① គណនា  ∇J(θ)
    return theta - alpha * grad      # ② អនុវត្ត  θ_new = θ_old − α·∇J(θ)
```

ជួរទី 3 គឺ formula update rule ខាងលើ សរសេរដោយផ្ទាល់ជា Python។

### ជំហានទី 3 — Loop រហូតដល់ Convergence

Run updates រហូតដល់ $|\nabla J(\theta)| < \varepsilon$ — នៅពេល gradient ស្ទើររកឃើញថាសូន្យ:

```python [gradient_descent.py] {5,8}
def gradient_descent(theta_init, alpha, epsilon=1e-6, max_iters=1000):
    theta = theta_init                           # θ₀ — ចំណុចចាប់ផ្ដើម
    for i in range(max_iters):
        grad = gradient(theta)                   # ∇J(θ) = 2θ
        if abs(grad) < epsilon:                  # ឈប់: |∇J(θ)| < ε
            print(f"Converged at iteration {i}")
            break
        theta = theta - alpha * grad             # θ_new = θ_old − α·∇J(θ)
        if i < 5:
            print(f"  iter {i+1:2d}: θ={theta:.5f}  J={cost(theta):.5f}  ∇J={grad:.5f}")
    return theta
# ស្របតាម ការគណនា manual ខាងលើ: θ₀ = 10, α = 0.1
theta_min = gradient_descent(theta_init=10.0, alpha=0.1)
print(f"\nMinimum at θ = {theta_min:.8f}")
```

**Output — ស្របតាម iterations manual ខាងលើ:**

```sh
  iter  1: θ= 8.00000  J=64.00000  ∇J=20.00000
  iter  2: θ= 6.40000  J=40.96000  ∇J=16.00000
  iter  3: θ= 5.12000  J=26.21440  ∇J=12.80000
  iter  4: θ= 4.09600  J=16.77722  ∇J=10.24000
  iter  5: θ= 3.27680  J=10.73742  ∇J= 8.19200
Minimum at θ = 0.00000001
```

### ជំហានទី 4 — Linear Regression: Parameters ពីរ

សម្រាប់ model $\hat{y} = wX + b$, cost function ប្រើ mean squared error:

$$J(w, b) = \frac{1}{m} \sum_{i=1}^{m} \left(\hat{y}^{(i)} - y^{(i)}\right)^2$$

ជាមួយ partial derivatives:

$$\frac{\partial J}{\partial w} = \frac{2}{m} \sum_{i=1}^{m} \left(\hat{y}^{(i)} - y^{(i)}\right) x^{(i)}, \qquad \frac{\partial J}{\partial b} = \frac{2}{m} \sum_{i=1}^{m} \left(\hat{y}^{(i)} - y^{(i)}\right)$$

```python [linear_regression_gd.py] {7-12}
import numpy as np

def linear_regression_gd(X, y, alpha=0.01, epochs=500):
    m = len(y)
    w, b = 0.0, 0.0                        # θ = [w, b] — initialize ទៅ zero
    for epoch in range(epochs):
        y_pred = w * X + b                 # forward pass:  ŷ = w·X + b
        error  = y_pred - y                # residuals:     ŷ − y
        dw = (2 / m) * np.dot(error, X)   # ∂J/∂w = (2/m) Σ (ŷ−y)·x
        db = (2 / m) * np.sum(error)       # ∂J/∂b = (2/m) Σ (ŷ−y)
        w = w - alpha * dw                 # w_new = w_old − α·∂J/∂w
        b = b - alpha * db                 # b_new = b_old − α·∂J/∂b
        if epoch % 100 == 0:
            loss = np.mean(error ** 2)     # J(w,b) = (1/m) Σ (ŷ−y)²
            print(f"Epoch {epoch:4d}: loss={loss:.4f}  w={w:.4f}  b={b:.4f}")
    return w, b

# y = 2·x  →  model គួរ converge ទៅ w≈2, b≈0
X = np.array([1.0, 2.0, 3.0, 4.0, 5.0])
y = np.array([2.0, 4.0, 6.0, 8.0, 10.0])
w, b = linear_regression_gd(X, y)
print(f"\nFitted:  ŷ = {w:.4f}·x + {b:.4f}")
```

**ជួរ highlighted 7–12** ទំនាក់ទំនងដោយផ្ទាល់ទៅ formulas:
- ជួរ 7–8: forward pass $\hat{y} = wX + b$ និង residuals
- ជួរ 9–10: partial derivatives $\frac{\partial J}{\partial w}$ និង $\frac{\partial J}{\partial b}$
- ជួរ 11–12: gradient descent update rule $\theta_{new} = \theta_{old} - \alpha \nabla J$

## ជំហានបន្ទាប់

នៅពេលអ្នកយល់ដឹង gradient descent, អ្នកអាចស្រាវជ្រាវ Algorithms បន្ថែមដូចជា:
- **Momentum**: បន្ថែមល្បឿនទៅក្នុងការ update
- **Adam**: Adaptive learning rates សម្រាប់ parameter នីមួយៗ
- **RMSprop**: គ្រប់គ្រង sparse gradients បានល្អជាង
  
---