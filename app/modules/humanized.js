(function() {
  "use strict";

  angular
    .module("segue.submission.humanized", [ 'segue.submission' ])
    .constant("HumanizedStrings", {
        // categories
        'business':          'corporativo',
        'caravan':           'caravanista',
        'caravan-leader':    'líder de caravana',
        'foreigner':         'estrangeiro',
        'foreigner-student': 'estrangeiro estudante',
        'government':        'empenho',
        'normal':            'individual',
        'promocode':         'código promocional',
        'proponent':         'proponente',
        'proponent-student': 'proponente estudante',
        'speaker':           'palestrante',
        'student':           'estudante',

        // payment types
        'cash':      'dinheiro',

        // purchase statuses
        'pending':    'pendente',
        'paid':       'pago',
        'reimbursed': 'reembolsado',
        'stale':      'vencido',

        // certificates
        'attendant': 'participante',
        'issued':    'emitido',
        'issuable':  'pendente'
    });
})();
