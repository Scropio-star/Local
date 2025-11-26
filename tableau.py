MAX_CONSTANTS = 10


# Parse a formula, consult parseOutputs for return values.
def parse(fmla):
    prop_res = is_prop_formula(fmla)
    if prop_res:
        return prop_res
    fol_res = is_fol_formula(fmla)
    if fol_res:
        return fol_res
    return 0

# Return the LHS of a binary connective formula
def lhs(fmla):
    parts = split_binary(fmla)
    if parts:
        return parts[0]
    return ''

# Return the connective symbol of a binary connective formula
def con(fmla):
    parts = split_binary(fmla)
    if parts:
        return parts[1]
    return ''

# Return the RHS symbol of a binary connective formula
def rhs(fmla):
    parts = split_binary(fmla)
    if parts:
        return parts[2]
    return ''


# You may choose to represent a theory as a set or a list
def theory(fmla):  # initialise a theory with a single formula in it
    branch = {
        'formulas': [],
        'formula_set': set(),
        'constants': [],
        'new_count': 0,
        'counter': 0,
        'used_gamma': {}
    }
    add_formula(branch, fmla)
    return branch

# check for satisfiability
def sat(tableau):
    undetermined = False
    while tableau:
        branch = tableau.pop()
        status = process_branch(branch, tableau)
        if status == 'open':
            return 1
        if status == 'limit':
            undetermined = True
    if undetermined:
        return 2
    return 0


def is_prop_atom(fmla):
    return fmla in ['p', 'q', 'r', 's']


def is_pred_atom(fmla):
    if len(fmla) < 5:
        return False
    if fmla[0] not in ['P', 'Q', 'R', 'S']:
        return False
    if fmla[1] != '(' or fmla[-1] != ')':
        return False
    inner = fmla[2:-1]
    comma_index = find_comma(inner)
    if comma_index == -1:
        return False
    t1 = inner[:comma_index]
    t2 = inner[comma_index + 1:]
    if not t1 or not t2:
        return False
    if not valid_term(t1) or not valid_term(t2):
        return False
    return True


def is_pred_atom_vars(fmla):
    if not is_pred_atom(fmla):
        return False
    inner = fmla[2:-1]
    comma_index = find_comma(inner)
    t1 = inner[:comma_index]
    t2 = inner[comma_index + 1:]
    return t1 in ['x', 'y', 'z', 'w'] and t2 in ['x', 'y', 'z', 'w']


def valid_term(term):
    if not term:
        return False
    for ch in term:
        if not ((ch >= 'a' and ch <= 'z') or (ch >= 'A' and ch <= 'Z') or (ch >= '0' and ch <= '9')):
            return False
    return True


def find_comma(inner):
    depth = 0
    for i, ch in enumerate(inner):
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        elif ch == ',' and depth == 0:
            return i
    return -1


def split_binary(fmla):
    if not fmla or fmla[0] != '(' or fmla[-1] != ')':
        return None
    content = fmla[1:-1]
    depth = 0
    i = 0
    while i < len(content):
        ch = content[i]
        if ch == '(':
            depth += 1
        elif ch == ')':
            depth -= 1
        if depth == 0:
            if ch == '&':
                left = content[:i]
                right = content[i + 1:]
                return (left, '&', right)
            if ch == '\\' and i + 1 < len(content) and content[i + 1] == '/':
                left = content[:i]
                right = content[i + 2:]
                return (left, '\\/', right)
            if ch == '-' and i + 1 < len(content) and content[i + 1] == '>':
                left = content[:i]
                right = content[i + 2:]
                return (left, '->', right)
        i += 1
    return None


def is_prop_formula(fmla):
    if is_prop_atom(fmla):
        return 6
    if fmla.startswith('~'):
        sub = fmla[1:]
        res = is_prop_formula(sub)
        if res:
            return 7
        return 0
    parts = split_binary(fmla)
    if parts:
        l_res = is_prop_formula(parts[0])
        r_res = is_prop_formula(parts[2])
        if l_res and r_res:
            return 8
    return 0


def is_fol_formula(fmla):
    if is_pred_atom_vars(fmla):
        return 1
    if fmla.startswith('~'):
        sub = fmla[1:]
        res = is_fol_formula(sub)
        if res:
            return 2
        return 0
    if fmla.startswith('A') or fmla.startswith('E'):
        if len(fmla) < 3:
            return 0
        var = fmla[1]
        if var not in ['x', 'y', 'z', 'w']:
            return 0
        sub = fmla[2:]
        sub_res = is_fol_formula(sub)
        if not sub_res:
            return 0
        if fmla[0] == 'A':
            return 3
        return 4
    parts = split_binary(fmla)
    if parts:
        l_res = is_fol_formula(parts[0])
        r_res = is_fol_formula(parts[2])
        if l_res and r_res:
            return 5
    return 0


def add_formula(branch, formula):
    if formula not in branch['formula_set']:
        branch['formulas'].append(formula)
        branch['formula_set'].add(formula)


def branch_closed(branch):
    for f in branch['formula_set']:
        if f.startswith('~'):
            if f[1:] in branch['formula_set']:
                return True
        else:
            if ('~' + f) in branch['formula_set']:
                return True
    return False


def clone_branch(branch):
    new_branch = {
        'formulas': list(branch['formulas']),
        'formula_set': set(branch['formula_set']),
        'constants': list(branch['constants']),
        'new_count': branch['new_count'],
        'counter': branch['counter'],
        'used_gamma': {}
    }
    for key in branch['used_gamma']:
        new_branch['used_gamma'][key] = set(branch['used_gamma'][key])
    return new_branch


def process_branch(branch, tableau):
    while True:
        if branch_closed(branch):
            return 'closed'
        selection = choose_formula(branch)
        if selection is None:
            return 'open'
        index, kind, data = selection
        formula = branch['formulas'].pop(index)
        branch['formula_set'].remove(formula)
        if kind == 'alpha':
            for f in data:
                add_formula(branch, f)
        elif kind == 'beta':
            b1 = clone_branch(branch)
            b2 = clone_branch(branch)
            add_formula(b1, data[0])
            add_formula(b2, data[1])
            tableau.append(b1)
            tableau.append(b2)
            return 'branched'
        elif kind == 'delta':
            var, sub = data
            const = new_constant(branch)
            if const is None:
                return 'limit'
            instantiated = substitute(sub, var, const)
            add_formula(branch, instantiated)
        elif kind == 'gamma':
            var, sub = data
            const = gamma_constant(branch, formula, var)
            if const is None:
                return 'limit'
            instantiated = substitute(sub, var, const)
            add_formula(branch, instantiated)
            record_gamma(branch, formula, const)
            add_formula(branch, formula)
        else:
            add_formula(branch, formula)


def choose_formula(branch):
    for idx, f in enumerate(branch['formulas']):
        kind, data = classify_formula(f, branch)
        if kind != 'literal':
            if kind == 'gamma' and not gamma_pending(branch, f, data[0]):
                continue
            return (idx, kind, data)
    return None


def classify_formula(fmla, branch):
    if is_literal(fmla):
        return ('literal', None)
    if fmla.startswith('~'):
        inner = fmla[1:]
        if inner.startswith('~'):
            return ('alpha', [inner[1:]])
        bin_parts = split_binary(inner)
        if bin_parts:
            l, c, r = bin_parts
            if c == '&':
                return ('beta', ['~' + l, '~' + r])
            if c == '\/':
                return ('alpha', ['~' + l, '~' + r])
            if c == '->':
                return ('alpha', [l, '~' + r])
        if inner.startswith('A'):
            return ('delta', (inner[1], '~' + inner[2:]))
        if inner.startswith('E'):
            return ('gamma', (inner[1], '~' + inner[2:]))
    else:
        bin_parts = split_binary(fmla)
        if bin_parts:
            l, c, r = bin_parts
            if c == '&':
                return ('alpha', [l, r])
            if c == '\/':
                return ('beta', [l, r])
            if c == '->':
                return ('beta', ['~' + l, r])
        if fmla.startswith('A'):
            return ('gamma', (fmla[1], fmla[2:]))
        if fmla.startswith('E'):
            return ('delta', (fmla[1], fmla[2:]))
    return ('literal', None)


def gamma_pending(branch, formula, var):
    if not branch['constants']:
        return True
    used = branch['used_gamma'].get(formula, set())
    for const in branch['constants']:
        if const not in used:
            return True
    return False


def record_gamma(branch, formula, const):
    if formula not in branch['used_gamma']:
        branch['used_gamma'][formula] = set()
    branch['used_gamma'][formula].add(const)


def new_constant(branch):
    if branch['new_count'] >= MAX_CONSTANTS:
        return None
    constant_pool = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
        'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v'
    ]
    idx = branch['counter']
    while idx < len(constant_pool) and constant_pool[idx] in branch['constants']:
        idx += 1
    if idx >= len(constant_pool):
        return None
    name = constant_pool[idx]
    branch['counter'] = idx + 1
    branch['constants'].append(name)
    branch['new_count'] += 1
    return name


def gamma_constant(branch, formula, var):
    if branch['constants']:
        used = branch['used_gamma'].get(formula, set())
        for const in branch['constants']:
            if const not in used:
                return const
    const = new_constant(branch)
    return const


def is_literal(fmla):
    if is_prop_atom(fmla) or is_pred_atom(fmla):
        return True
    if fmla.startswith('~'):
        inner = fmla[1:]
        if is_prop_atom(inner) or is_pred_atom(inner):
            return True
    return False


def substitute(fmla, var, const):
    if is_pred_atom(fmla):
        pred = fmla[0]
        inner = fmla[2:-1]
        comma_index = find_comma(inner)
        t1 = inner[:comma_index]
        t2 = inner[comma_index + 1:]
        if t1 == var:
            t1 = const
        if t2 == var:
            t2 = const
        return pred + '(' + t1 + ',' + t2 + ')'
    if fmla.startswith('~'):
        return '~' + substitute(fmla[1:], var, const)
    if fmla.startswith('A') or fmla.startswith('E'):
        bound_var = fmla[1]
        sub = fmla[2:]
        if bound_var == var:
            return fmla
        return fmla[0] + bound_var + substitute(sub, var, const)
    parts = split_binary(fmla)
    if parts:
        left = substitute(parts[0], var, const)
        right = substitute(parts[2], var, const)
        return '(' + left + parts[1] + right + ')'
    return fmla

#------------------------------------------------------------------------------------------------------------------------------:
#                                            DO NOT MODIFY THE CODE BELOW THIS LINE!                                           :
#------------------------------------------------------------------------------------------------------------------------------:

f = open('input.txt')

parseOutputs = ['not a formula',
                'an atom',
                'a negation of a first order logic formula',
                'a universally quantified formula',
                'an existentially quantified formula',
                'a binary connective first order formula',
                'a proposition',
                'a negation of a propositional formula',
                'a binary connective propositional formula']

satOutput = ['is not satisfiable', 'is satisfiable', 'may or may not be satisfiable']



firstline = f.readline()

PARSE = False
if 'PARSE' in firstline:
    PARSE = True

SAT = False
if 'SAT' in firstline:
    SAT = True

for line in f:
    if line[-1] == '\n':
        line = line[:-1]
    parsed = parse(line)

    if PARSE:
        output = "%s is %s." % (line, parseOutputs[parsed])
        if parsed in [5,8]:
            output += " Its left hand side is %s, its connective is %s, and its right hand side is %s." % (lhs(line), con(line) ,rhs(line))
        print(output)

    if SAT:
        if parsed:
            tableau = [theory(line)]
            print('%s %s.' % (line, satOutput[sat(tableau)]))
        else:
            print('%s is not a formula.' % line)
