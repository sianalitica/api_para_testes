SELECT 
    documentos_brutos.texto,
    documentos_brutos.ext,
    documentos_info.categoria,
    documentos_info.tipo,
    documentos_info.especie,
    documentos_info.data_referencia,
    documentos_info.data_entrega,
    documentos_info.status,
    documentos_info.v,
    documentos_info.modalidade
    FROM
        documentos_brutos 
    JOIN
        documentos_info ON documentos_info.id = documentos_brutos.documento_info_id
    WHERE
        documentos_info.categoria = "Valores Mobiliários Negociados e Detidos";

SELECT 
    documentos_info.id as documentoinfo_id,
    documentos_info.categoria,
    documentos_info.tipo,
    documentos_info.data_referencia,
    documentos_info.data_entrega,
    documentos_info.status,
    (SELECT count(documentos_brutos.id) from documentos_brutos where documentos_brutos.documento_info_id = documentoinfo_id) as total_documentos
    from documentos_info
     WHERE
        documentos_info.categoria = "Dados Econômico-Financeiros" and tipo = "Press-release";

select distinct categoria from documentos_info;