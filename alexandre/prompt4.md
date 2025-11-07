Observei que o editorjs já tem nativamente os slash commands, ou seja, toda a implementação de JS complementar foi criada para implementar os slashcommands como implementSlashCommands() e executeSlashCommand são desnecessárias e podem ser removidas.


Preciso então que você plajeje e execute:

- remover as as implementações implementSlashCommands() e executeSlashCommand()
- implementar o https://editorjs.io/ da maneira mais simples e nativa possível para não alterar seu comportamento original
- persistir o conteúdo resultante do editorjs diretamente no content do model Page.


Caso seja necessário consulte a documentação do https://editorjs.io/base-concepts/.

Testar a implantação do editorjs e só concluir a tarefa quando obtiver sucesso.
