---
title: 'ស្វែងយល់ពី Algorithm Gradient Descent'
description: 'ស្វែងយល់ពីរ Algorithm ដែលជាមូលដ្ឋានគ្រឹះនៃ Machine Learning។ យល់ដឹងពីរបៀបដែលវាស្វែងរកតម្លៃអប្បបរមានៃអនុគមន៍ម្តងមួយជំហានៗ។'
author: 'ចៅ ដារ៉ា - Founder of TFDevs'
date: '2026-03-19'
---
<div class="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-2" style="height: 300px;">
  <img src="/assets/img/gradient_2.gif" alt="Gradient Descent Illustration" class="w-full h-full" style="object-fit: contain;" />
</div>
<p class="text-center text-sm text-text-secondary mb-6 italic">
  រូបភាពយកមកពី: <a href="https://towardsdatascience.com/creating-a-gradient-descent-animation-in-python-3c4dcd20ca51-2/" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Creating a Gradient Descent Animation in Python</a>
</p>

Gradient Descent គឺជា optimization algorithm មូលដ្ឋានមួយ ក្នុងចំណោម algorithms ដែលមាននៅក្នុង machine learning។ វាជាវិធីសាស្រ្តសម្រាប់ស្វែងរកតម្លៃអប្បបរមានៃអនុគមន៏ ដោយដើរម្តងមួយជំហាន (iteration) ជាបន្តបន្ទាប់ក្នុងទិសដៅ ដែលធ្វើឲ្យអនុគមន៏កាន់តែតូចទៅៗ។

## ប្រៀបធាបលេងៗ

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

## ជំហានបន្ទាប់

នៅពេលអ្នកយល់ដឹង gradient descent, អ្នកអាចស្រាវជ្រាវ Algorithms បន្ថែមដូចជា:
- **Momentum**: បន្ថែមល្បឿនទៅក្នុងការ update
- **Adam**: Adaptive learning rates សម្រាប់ parameter នីមួយៗ
- **RMSprop**: គ្រប់គ្រង sparse gradients បានល្អជាង
  
---