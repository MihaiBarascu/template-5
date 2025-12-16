# Ghid de Lucru: User + Claude Code

## Principii Fundamentale

> "AI context is like milk - it's best served fresh and condensed"

1. **Conversații proaspete** - Task nou = Conversație nouă
2. **Context clar** - Spune ce vrei, nu cum să fac
3. **Verificare sistematică** - Testăm tot înainte de "gata"
4. **Documentare** - Ce învățăm azi, nu repetăm mâine

---

## 🧑 Cum să te comporți TU (User)

### La Începutul Sesiunii

```
✅ CORECT:
"Vreau să adaug un nou tip de business: florărie"

❌ GREȘIT:
"Continuă ce făceam ieri cu acel bug"
```

**Checklist start sesiune:**
- [ ] Conversație nouă pentru task major
- [ ] Descrie GOAL-ul, nu pașii
- [ ] Menționează fișierele relevante dacă știi
- [ ] Spune dacă e urgent sau exploratory

### Când Ceri Ceva

```
✅ CORECT:
"Portfolio-ul nu afișează linkuri externe.
Ar trebui să ducă pe site-urile demo când dai click."

❌ GREȘIT:
"Nu merge portofoliul, repară-l"
```

**Pattern pentru cereri:**
1. **Ce** nu funcționează / ce vrei
2. **Unde** (pagină, componentă)
3. **Cum** ar trebui să funcționeze
4. **Context** (dacă e relevant)

### Când Primești Cod

```
✅ CORECT:
"Arată bine. Fă build și testează."
"Nu înțeleg de ce ai folosit X. Explică."
"Simplifică asta, pare prea complicat."

❌ GREȘIT:
"OK" (fără verificare)
"Merge" (fără testare)
```

**Întrebări de pus:**
- "E cea mai simplă soluție?"
- "Ce ar putea să nu meargă?"
- "Fă un tabel cu ce ai verificat"

### Când Ceva Nu Merge

```
✅ CORECT:
"Am eroare: [paste eroare exactă]
Am încercat X și Y, nu a mers."

❌ GREȘIT:
"Nu merge"
"Dă eroare"
```

**Include:**
- Eroarea exactă (copy-paste)
- Ce ai încercat
- Ce te așteptai să se întâmple

### La Sfârșitul Sesiunii

```
✅ CORECT:
"Salvează ce am făcut azi într-un HANDOFF.md"
"/compact"

❌ GREȘIT:
*închizi fără să salvezi contextul*
```

**Checklist final sesiune:**
- [ ] Toate modificările comise în git
- [ ] Build reușit
- [ ] Teste trec
- [ ] HANDOFF.md creat (dacă sesiune lungă)

---

## 🤖 Cum mă comport EU (Claude)

### La Începutul Task-ului

**VOI face:**
```
1. Clarific goal-ul dacă e ambiguu
2. Propun plan înainte să scriu cod
3. Menționez riscuri/trade-offs
4. Întreb dacă abordarea e OK
```

**NU voi face:**
```
- Sări direct la cod fără plan
- Presupun ce vrei fără să întreb
- Ignor contextul proiectului
```

### Când Scriu Cod

**VOI face:**
```
1. Cod simplu și clar (nu over-engineer)
2. Folosesc pattern-urile existente din proiect
3. Respect theme tokens (nu hardcode culori)
4. Adaug error handling unde e necesar
5. Verific că build-ul trece
```

**NU voi face:**
```
- Soluții complicate când există simple
- Ignor stilul existent al codului
- Hardcode valori (culori, URL-uri, etc)
- Presupun că merge fără să testez
```

### Când Termin un Task

**VOI face:**
```
1. Rulez build pentru verificare
2. Creez tabel de verificare
3. Menționez ce NU am testat
4. Propun next steps dacă există
```

**Format verificare:**
| Ce am verificat | Status | Cum |
|-----------------|--------|-----|
| Build compilează | ✅ | npm run build |
| Pagina se încarcă | ✅ | curl localhost |
| Linkuri funcționează | ⚠️ | Nu am testat click |

### Când Ceva E Greșit

**VOI face:**
```
1. Recunosc greșeala clar
2. Explic CE a mers prost
3. Propun fix concret
4. Verific că fix-ul funcționează
```

**NU voi face:**
```
- Ignor eroarea
- Dau vina pe altceva
- Fac fix fără să testez
```

---

## 📋 Workflow Standard

### Task Simplu (< 30 min)

```
USER: Descrie task-ul clar
CLAUDE: Clarific dacă e nevoie → Implementez → Verific → Raportez

Exemplu:
USER: "Schimbă textul din hero la 'Website Profesional'"
CLAUDE: *editez* → *verific build* → "Gata, am schimbat. Build OK."
```

### Task Mediu (30 min - 2h)

```
1. USER: Descrie goal-ul
2. CLAUDE: Propun plan cu pași
3. USER: Aprob/ajustez planul
4. CLAUDE: Implementez pas cu pas
5. CLAUDE: Verific și raportez
6. USER: Testează și confirmă

Exemplu:
USER: "Adaugă un bloc nou de testimoniale video"
CLAUDE: "Plan:
1. Creez config în blocks/
2. Creez Component.tsx
3. Adaug în RenderBlocks
4. Testez cu seed
OK să încep?"
```

### Task Complex (> 2h)

```
1. USER: Descrie goal-ul mare
2. CLAUDE: Descompun în sub-tasks
3. USER: Prioritizăm împreună
4. CLAUDE: Rezolv task 1 → Verific
5. USER: Confirmă task 1
6. CLAUDE: Rezolv task 2 → Verific
... repeat ...
7. CLAUDE: Creez HANDOFF.md la final
```

---

## 🚨 Reguli de Aur

### Pentru USER:

1. **O conversație = Un task major**
   - Debugging cart ≠ adăugare feature nouă

2. **Spune goal-ul, nu implementarea**
   - "Vreau ca userii să vadă prețul cu TVA" ✅
   - "Adaugă o funcție calculateVAT în utils" ❌

3. **Cere simplitate**
   - "Asta pare complicat. Simplifică."
   - "De ce ai nevoie de asta? Explică."

4. **Verifică înainte de "merge"**
   - Build trece?
   - Arată corect în browser?
   - Edge cases testate?

5. **Documentează problemele mari**
   - "Adaugă asta în LESSONS-INDEX.md"

### Pentru CLAUDE:

1. **Întreabă înainte să presupui**
   - Dacă nu e clar, clarific

2. **Plan înainte de cod**
   - Propun approach, aștept OK

3. **Simplu > Complicat**
   - Cea mai simplă soluție care funcționează

4. **Verific tot**
   - Build, render, edge cases

5. **Recunosc limitările**
   - "Nu pot testa X, verifică manual"

---

## 📝 Templates

### Cerere Feature Nouă
```
GOAL: [Ce vreau să obțin]
CONTEXT: [Unde în aplicație]
COMPORTAMENT: [Cum ar trebui să funcționeze]
EXEMPLE: [Dacă există referințe]
```

### Raport Bug
```
EROARE: [Paste exact error]
PAȘI REPRODUCERE:
1. Fac X
2. Apăs Y
3. Văd eroarea

AȘTEPTAT: [Ce ar trebui să se întâmple]
ACTUAL: [Ce se întâmplă]
```

### HANDOFF.md Template
```markdown
# Handoff: [Nume Task]
Data: YYYY-MM-DD

## Ce am făcut
- Item 1
- Item 2

## Ce funcționează
- ✅ Feature 1
- ✅ Feature 2

## Ce NU am terminat
- ⏳ Item rămas

## Next steps
1. Pasul următor
2. De verificat

## Fișiere modificate
- path/to/file1.ts
- path/to/file2.tsx
```

---

## ⚡ Quick Reference

### Comenzi Utile
```bash
# Alias-uri (adaugă în ~/.bashrc)
alias t5='cd ~/Desktop/website-templates/template-5'
alias seedmulti='SEED_TYPE=multiweb pnpm seed'
alias cleancache='rm -rf .next && pnpm dev'
```

### Prompturi Eficiente
```
"Fă un plan înainte să implementezi"
"Simplifică, pare complicat"
"Creează tabel de verificare"
"Ce ar putea să nu meargă?"
"Adaugă în LESSONS-INDEX dacă e important"
```

### La Final de Sesiune
```
1. "Commit toate schimbările"
2. "Rulează build"
3. "Creează HANDOFF.md"
4. /compact (dacă conversație lungă)
```

---

*Ultima actualizare: 2025-12-16*
