var util = require('util');
var _ = require('lodash');
var builder = require('botbuilder');

module.exports = function trainer(session) {
    var cards = getTrainerAttachments();

    // create reply with Carousel AttachmentLayout
    var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

    session.send(reply);
    session.endDialog();
};


function getTrainerAttachments(session) {
    return [
        new builder.HeroCard(session)
            .title('Deposit Process')
            .subtitle('We will guid you to make deposits from CRM and adding amount into your MT4 account')
            .text('Deposits from crm helps you to add money into your MT4 account. This amount you can use for Trading')
            .images([
                builder.CardImage.create(session, 'http://img.etimg.com/thumb/msid-51580595,width-672,resizemode-4,imglength-32468/wealth/earn/post-rate-cut-is-a-co-op-bank-deposit-a-good-bet/bank-deposit.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://drive.google.com/file/d/0B0unhSOwQlp-UUFRbmpNNUktRlU/view', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('Commission')
            .subtitle('check your commission report from CRM')
            .text('Commission will be paid everyday from CRM, you can check the transaction details in CRM')
            .images([
                builder.CardImage.create(session, 'http://www.grupotaiga.com.br/assets/uploads/z.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://drive.google.com/file/d/0B0unhSOwQlp-OEprLUs3YzZKRms/view?usp=sharing ', 'Learn More')
            ]),

            new builder.ThumbnailCard(session)
            .title('Withdrawal')
            .subtitle('Withdraw your amount from CRM')
            .text('you can withdraw amount into your bank account,Learn here How to make withdraw request on CRM')
            .images([
                builder.CardImage.create(session, 'http://img.cdn2.vietnamnet.vn/Images/english/2012/10/12/07/20121012075408_capital.jpg')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://drive.google.com/file/d/0B0unhSOwQlp-UThPN0NwNURqRmM/view?usp=sharing', 'Learn More')
            ]),
 ];
}
