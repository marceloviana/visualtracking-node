#!/bin/bash
# By Marcelo Viana Almeida

PUBLIC_IP="$1"
USER="$2"
PRIVATE_KEY_PATH="$3"
run_ansible_for_ec2_instance="$4"
SERVER_PORT="$5"
timeout=3

if [ "$run_ansible_for_ec2_instance" == "no"];then
    echo "Execute o Ansible manualmente."
    exit 0
fi

ssh -V

while true;
do

    sleep 3
    ssh -o StrictHostKeychecking=no -o ConnectTimeout=5 -i $PRIVATE_KEY_PATH $USER@$PUBLIC_IP -p $SERVER_PORT "echo `date`" > /dev/null 2>&1
    if [ $? -eq 0 ];then
        echo "EC2 connect successfully"
        break
    fi
    echo "Aguardando resposta de $PUBLIC_IP:$SERVER_PORT..."
 
    ((timeout--))
    if [ $timeout -eq 0 ];then
        echo "Impossível conectar em $PUBLIC_IP:$SERVER_PORT"
        exit 1
    fi

done

echo "Configurando Ansible /etc/ansible/hosts"
cat <<EOF > /etc/ansible/hosts
[aws_devops]
$PUBLIC_IP:$SERVER_PORT ansible_ssh_private_key_file=$PRIVATE_KEY_PATH ansible_user=$USER

[aws_devops:vars]
ansible_python_interpreter=/usr/bin/python3
EOF

echo `pwd`
echo "Implantando configurações em $PUBLIC_IP:$SERVER_PORT com Ansible..."
cd ./ansible && /root/.local/bin/ansible-playbook -i /etc/ansible/hosts playbook.yml
