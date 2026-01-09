from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import json

app = Flask(__name__)

# Configuração
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB max
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'}

# CORS
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:3001"]}})

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Banco de dados em memória (lista de eventos)
eventos = [
    {
        'id': 112,
        'identificacao': 'de Operações com Balões da Região Amazônica (COBRA), em parceria com a UFT, para viabilizar a realização de lançamentos de balões estratosféricos',
        'organizador': 'CNES',
        'dataInicio': '2025-01-12',
        'dataFim': '2025-01-12',
        'tipoEvento': 'Reunião/Visita Técnica',
        'ambito': 'Internacional',
        'pais': 'França',
        'cidade': 'TOULOUSE',
        'status': 'Aprovado',
        'valorPrevisto': 30655.96,
        'ultimaAtualizacao': '2025-01-12',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 110,
        'identificacao': 'Acompanhamento da visita da Ministra Luciana Santos ao Instituto Federal do Maranhão',
        'organizador': 'AEB/URMA',
        'dataInicio': '2025-01-22',
        'dataFim': '2025-01-22',
        'tipoEvento': 'Reunião/Visita Técnica',
        'ambito': 'Nacional',
        'pais': 'Brasil',
        'uf': 'MA',
        'cidade': 'SÃO LUÍS',
        'status': 'Aprovado',
        'valorPrevisto': 574.10,
        'ultimaAtualizacao': '2025-01-22',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 87,
        'identificacao': 'Substituição da coordenadora da Unidade Regional do Rio Grande do Norte, referente às férias',
        'organizador': 'AEB',
        'dataInicio': '2025-01-26',
        'dataFim': '2025-01-26',
        'tipoEvento': 'Reunião/Visita Técnica',
        'ambito': 'Nacional',
        'pais': 'Brasil',
        'uf': 'RN',
        'cidade': 'NATAL',
        'status': 'Aprovado',
        'valorPrevisto': 5386.15,
        'ultimaAtualizacao': '2025-01-26',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 96,
        'identificacao': 'Cerimônia de passagem da Direção-Geral do DCTA',
        'organizador': 'DCTA',
        'dataInicio': '2025-01-30',
        'dataFim': '2025-01-30',
        'tipoEvento': 'Solenidade',
        'ambito': 'Nacional',
        'pais': 'Brasil',
        'uf': 'SP',
        'cidade': 'SÃO JOSÉ DOS CAMPOS',
        'status': 'Aprovado',
        'valorPrevisto': 2542.59,
        'ultimaAtualizacao': '2025-01-30',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 109,
        'identificacao': 'OpenLab de Inteligência Artificial (IA)',
        'organizador': 'AEB/URMA; Universitário Dom Delgado',
        'dataInicio': '2025-02-02',
        'dataFim': '2025-02-02',
        'tipoEvento': 'Solenidade',
        'ambito': 'Nacional',
        'pais': 'Brasil',
        'uf': 'MA',
        'cidade': 'SÃO LUÍS',
        'status': 'Aprovado',
        'valorPrevisto': 619.55,
        'ultimaAtualizacao': '2025-02-02',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 47,
        'identificacao': '"African and Middle East Space Conference (AMESC) 2025"',
        'organizador': 'Iniciativa Marroquina para a Indústria Espacial (IMSI)',
        'dataInicio': '2025-02-03',
        'dataFim': '2025-02-03',
        'tipoEvento': 'Congresso/Seminário/Workshop/Feira',
        'ambito': 'Internacional',
        'pais': 'Marrocos',
        'cidade': 'RABAT',
        'status': 'Aprovado',
        'valorPrevisto': 5372.65,
        'ultimaAtualizacao': '2025-02-03',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    },
    {
        'id': 53,
        'identificacao': 'Cyber Security 360',
        'organizador': 'NTSEC',
        'dataInicio': '2025-02-05',
        'dataFim': '2025-02-05',
        'tipoEvento': 'Congresso/Seminário/Workshop/Feira',
        'ambito': 'Nacional',
        'pais': 'Brasil',
        'uf': 'BA',
        'cidade': 'SALVADOR',
        'status': 'Aprovado',
        'valorPrevisto': 4126.00,
        'ultimaAtualizacao': '2025-02-05',
        'justificativa': '',
        'observacoes': '',
        'anexos': []
    }
]

next_id = 200

# Funções auxiliares
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_eventos_by_year(year):
    """Filtra eventos por ano"""
    if year == 'sem-data':
        return [e for e in eventos if not e.get('dataInicio')]
    return [e for e in eventos if e.get('dataInicio', '').startswith(str(year))]

def get_status_counts(eventos_list):
    """Conta eventos por status"""
    counts = {
        'Em Aberto': 0,
        'Em Análise': 0,
        'Não Aprovado': 0,
        'Aprovado': 0,
        'Cancelado': 0,
        'Aprovado para ajustes': 0
    }
    
    for evento in eventos_list:
        status = evento.get('status')
        if status in counts:
            counts[status] += 1
    
    return counts

def filter_eventos(query_params):
    """Aplica filtros aos eventos"""
    filtered = eventos.copy()
    
    # Filtro por ano
    ano = query_params.get('ano')
    if ano:
        filtered = get_eventos_by_year(ano)
    
    # Filtro por status
    status = query_params.get('status')
    if status:
        filtered = [e for e in filtered if e.get('status') == status]
    
    # Filtro por identificação (busca textual)
    identificacao = query_params.get('identificacao', '').lower()
    if identificacao:
        filtered = [e for e in filtered if identificacao in e.get('identificacao', '').lower()]
    
    # Filtro por organizador
    organizador = query_params.get('organizador', '').lower()
    if organizador:
        filtered = [e for e in filtered if organizador in e.get('organizador', '').lower()]
    
    # Filtro por tipo de evento
    tipo_evento = query_params.get('tipoEvento')
    if tipo_evento:
        filtered = [e for e in filtered if e.get('tipoEvento') == tipo_evento]
    
    # Filtro por âmbito
    ambito = query_params.get('ambito')
    if ambito:
        filtered = [e for e in filtered if e.get('ambito') == ambito]
    
    # Filtro por país
    pais = query_params.get('pais')
    if pais:
        filtered = [e for e in filtered if e.get('pais') == pais]
    
    # Ordenar por data (mais recente primeiro)
    filtered.sort(key=lambda x: x.get('dataInicio', ''), reverse=True)
    
    return filtered

# Rotas da API

@app.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    """Retorna estatísticas do dashboard"""
    eventos_2026 = get_eventos_by_year('2026')
    eventos_2025 = get_eventos_by_year('2025')
    eventos_sem_data = get_eventos_by_year('sem-data')
    
    return jsonify({
        '2026': {
            'total': len(eventos_2026),
            'status': get_status_counts(eventos_2026)
        },
        '2025': {
            'total': len(eventos_2025),
            'status': get_status_counts(eventos_2025)
        },
        'sem-data': {
            'total': len(eventos_sem_data),
            'status': get_status_counts(eventos_sem_data)
        }
    })

@app.route('/api/eventos', methods=['GET'])
def get_eventos():
    """Lista eventos com filtros opcionais"""
    filtered = filter_eventos(request.args)
    return jsonify(filtered)

@app.route('/api/eventos/<int:evento_id>', methods=['GET'])
def get_evento(evento_id):
    """Retorna um evento específico"""
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    
    if not evento:
        return jsonify({'error': 'Evento não encontrado'}), 404
    
    return jsonify(evento)

@app.route('/api/eventos', methods=['POST'])
def create_evento():
    """Cria novo evento"""
    global next_id
    
    data = request.get_json()
    
    novo_evento = {
        'id': next_id,
        **data,
        'status': data.get('status', 'Em Aberto'),
        'ultimaAtualizacao': datetime.now().strftime('%Y-%m-%d'),
        'anexos': []
    }
    
    eventos.append(novo_evento)
    next_id += 1
    
    return jsonify(novo_evento), 201

@app.route('/api/eventos/<int:evento_id>', methods=['PUT'])
def update_evento(evento_id):
    """Atualiza evento existente"""
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    
    if not evento:
        return jsonify({'error': 'Evento não encontrado'}), 404
    
    data = request.get_json()
    
    # Atualizar campos
    for key, value in data.items():
        if key != 'id':  # Não permitir alteração do ID
            evento[key] = value
    
    evento['ultimaAtualizacao'] = datetime.now().strftime('%Y-%m-%d')
    
    return jsonify(evento)

@app.route('/api/eventos/<int:evento_id>', methods=['DELETE'])
def delete_evento(evento_id):
    """Remove evento"""
    global eventos
    
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    
    if not evento:
        return jsonify({'error': 'Evento não encontrado'}), 404
    
    eventos = [e for e in eventos if e['id'] != evento_id]
    
    return jsonify({'message': 'Evento deletado com sucesso'})

@app.route('/api/eventos/<int:evento_id>/anexo', methods=['POST'])
def upload_anexo(evento_id):
    """Upload de arquivo anexo"""
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    
    if not evento:
        return jsonify({'error': 'Evento não encontrado'}), 404
    
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'Nome de arquivo vazio'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
    
    # Salvar arquivo
    filename = secure_filename(file.filename)
    timestamp = int(datetime.now().timestamp() * 1000)
    filename_with_timestamp = f"{timestamp}_{filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename_with_timestamp)
    file.save(filepath)
    
    # Adicionar anexo ao evento
    anexo = {
        'id': timestamp,
        'nome': filename,
        'path': filepath,
        'url': f"http://localhost:5000/uploads/{filename_with_timestamp}"
    }
    
    evento['anexos'].append(anexo)
    
    return jsonify(anexo), 201

@app.route('/api/eventos/<int:evento_id>/anexo/<int:anexo_id>', methods=['DELETE'])
def delete_anexo(evento_id, anexo_id):
    """Remove anexo"""
    evento = next((e for e in eventos if e['id'] == evento_id), None)
    
    if not evento:
        return jsonify({'error': 'Evento não encontrado'}), 404
    
    anexo = next((a for a in evento['anexos'] if a['id'] == anexo_id), None)
    
    if not anexo:
        return jsonify({'error': 'Anexo não encontrado'}), 404
    
    # Deletar arquivo do disco
    if os.path.exists(anexo['path']):
        os.remove(anexo['path'])
    
    # Remover anexo da lista
    evento['anexos'] = [a for a in evento['anexos'] if a['id'] != anexo_id]
    
    return jsonify({'message': 'Anexo deletado com sucesso'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """Serve arquivos enviados"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Rota de teste
@app.route('/')
def index():
    return jsonify({
        'message': 'API Sistema de Gestão de Eventos AEB',
        'version': '1.0.0',
        'endpoints': {
            'dashboard': '/api/dashboard',
            'eventos': '/api/eventos',
            'evento': '/api/eventos/<id>',
            'upload': '/api/eventos/<id>/anexo'
        }
    })

# Tratamento de erros
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Rota não encontrada'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erro interno do servidor'}), 500

if __name__ == '__main__':
    print('🚀 Servidor Flask rodando em http://localhost:5000')
    print('📊 Dashboard: http://localhost:5000/api/dashboard')
    print('📋 Eventos: http://localhost:5000/api/eventos')
    print('\nPressione Ctrl+C para parar o servidor\n')
    
    app.run(host='0.0.0.0', port=5000, debug=True)
