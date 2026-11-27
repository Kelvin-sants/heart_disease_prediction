# Resumo do pipeline e resultados (baseline)

Anotações rápidas sobre o que já foi feito no `notebooks/heart_disease_prediction.ipynb` pra alinhar com o grupo antes de começar a testar outros modelos.

## 1. O que tem nos dados e pré-processamento

O dataset tem **918 pacientes** e **11 features** pra prever `HeartDisease` (410 sem doença / 44,7% e 508 com doença / 55,3%).

Algumas coisas que apareceram na exploração:
- Não tem `NaN`, mas `Cholesterol` tem **172 zeros (18,7%)** e `RestingBP` tem **1 zero (0,1%)**. Como ninguém tem colesterol ou pressão 0 vivo, o pipeline trata esses zeros como faltantes e preenche com a mediana (`SimpleImputer(missing_values=0, strategy="median")`). No treino, a mediana do colesterol sobe de 223 pra 237 depois disso.
- No `ChestPainType`, quem é assintomático (`ASY`) tem bem mais caso positivo (79,0%, 392 de 496), enquanto angina atípica (`ATA`) tem só 13,9% (24 de 173).

A divisão ficou em **60% treino (550)**, **20% validação (184)** e **20% teste (184)** usando `train_test_split` estratificado com `random_state=42`. O `X_test` e `y_test` estão separados e ninguém mexe neles até fechar o modelo final.

O `ColumnTransformer` roda dentro do `Pipeline` pra calcular medianas, médias/desvios e categorias só no treino (no final viram 20 colunas depois do One-Hot):
- `Cholesterol` e `RestingBP`: troca `0` pela mediana + `StandardScaler`
- `Age`, `FastingBS`, `MaxHR`, `Oldpeak`: mediana + `StandardScaler`
- `Sex`, `ChestPainType`, `RestingECG`, `ExerciseAngina`, `ST_Slope`: `OneHotEncoder(handle_unknown="ignore")`

## 2. Resultado do primeiro modelo (Random Forest baseline)

Rodei um `RandomForestClassifier` básico (`n_estimators=100`, `max_depth=5`, `random_state=42`) pra ter uma referência inicial na validação:

| Métrica | Validação (184 pacientes) |
|---|---:|
| Acurácia | 0.8043 |
| Precisão | 0.8173 |
| Recall | 0.8333 |
| F1 | 0.8252 |
| AUC-ROC | 0.9029 |

Matriz de confusão (`[[VN, FP], [FN, VP]]`):

|  | Previsto 0 | Previsto 1 | Total |
|---|---:|---:|---:|
| **Real 0** | 63 | 19 | 82 |
| **Real 1** | 17 | 85 | 102 |

**Resumo do que deu:**
- Acertou 148 de 184 na validação (80,4%) e ficou com AUC de 0,9029.
- Dos 102 pacientes doentes na validação, pegou **85** e deixou passar **17** (falsos negativos). Dos 82 sem doença, deu **19** alarmes falsos.
- Vale lembrar que a validação só tem 184 linhas, então cada paciente vale ~0,54% nas métricas. Diferença de 1 ou 2 acertos entre testes pode ser só variação da amostra.

## 3. Ideias do que testar agora na validação

Antes de abrir o conjunto de teste, dá pra dividir entre o grupo alguns testes mantendo o mesmo split (`random_state=42`):

1. **Testar outros valores de `max_depth`** (`3`, `5`, `7`, `10`, `None`) e olhar treino vs. validação pra ver se `max_depth=5` tá segurando demais o modelo ou se aumentar dá overfitting.
2. **Testar `class_weight="balanced"` e threshold menor que 0.5** (tipo `0.40` ou `0.35`) pra ver se a gente baixa aqueles 17 falsos negativos sem estragar muito a precisão.
3. **Comparar outros modelos** (Regressão Logística, XGBoost/GradientBoosting, SVM) usando o mesmo `prep`.
4. **Rodar `StratifiedKFold` (5 ou 10 folds)** juntando treino+validação (os 80%) pra ter certeza de que o modelo escolhido não deu sorte só nesse split.

| Teste | Configuração | Acc | Prec | Recall | F1 | AUC | VN / FP / FN / VP | Obs |
|---|---|---:|---:|---:|---:|---:|---|---|
| Baseline | mediana, 100 arv., depth=5 | 0.8043 | 0.8173 | 0.8333 | 0.8252 | 0.9029 | 63 / 19 / 17 / 85 | Base inicial |
| Teste 1 | | | | | | | | |
| Teste 2 | | | | | | | | |