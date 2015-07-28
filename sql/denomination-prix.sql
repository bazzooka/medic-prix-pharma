SELECT arti_cip_acl, arti_num, arti_inti_long, arti_codeb2, tarif.PV_TTC -- , cntf.cntf_acte  
FROM p01arti arti
LEFT JOIN tari_pv tarif on arti.arti_num = tarif.ARTI_pv
WHERE arti_inti_long LIKE "DOLIP%"
AND PV_TTC IS NOT NULL